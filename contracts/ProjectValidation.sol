// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract ProjectValidation is AccessControl {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    
    bytes32 public constant PROJECT_OWNER_ROLE = keccak256("PROJECT_OWNER_ROLE");
    bytes32 public constant SABZA_VALIDATOR_ROLE = keccak256("SABZA_VALIDATOR_ROLE");
    bytes32 public constant BITBOND_ISSUER_ROLE = keccak256("BITBOND_ISSUER_ROLE");
    
    enum ValidationStatus {
        Pending,
        SABZAValidated,
        ReadyForTokenization,
        Tokenized,
        Rejected
    }
    
    struct Project {
        string projectId;
        string ipfsCID;
        string expectedSHA256Hash;
        string actualSHA256Hash;
        string tokenSymbol;
        address projectOwner;
        address sabzaValidator;
        ValidationStatus status;
        uint256 submissionTimestamp;
        uint256 validationTimestamp;
        uint256 tokenizationTimestamp;
        string metadata;
        bool isReadyForBitbond;
    }
    
    mapping(string => Project) public projects;
    mapping(string => string) public tokenToProject; // tokenSymbol => projectId
    mapping(address => bool) public authorizedSABZAValidators;
    mapping(address => bool) public authorizedBitbondIssuers;
    
    string[] public projectIds;
    
    // Events
    event ProjectSubmitted(
        string indexed projectId,
        string ipfsCID,
        address indexed projectOwner,
        string expectedHash,
        uint256 timestamp
    );
    
    event SABZAValidationCompleted(
        string indexed projectId,
        string actualHash,
        address indexed sabzaValidator,
        bool isValid,
        uint256 timestamp
    );
    
    event ProjectReadyForTokenization(
        string indexed projectId,
        string tokenSymbol,
        uint256 timestamp
    );
    
    event ProjectTokenized(
        string indexed projectId,
        string tokenSymbol,
        address indexed bitbondIssuer,
        uint256 timestamp
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SABZA_VALIDATOR_ROLE, msg.sender);
    }
    
    modifier onlyProjectOwner() {
        require(hasRole(PROJECT_OWNER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized project owner");
        _;
    }
    
    modifier onlySABZAValidator() {
        require(hasRole(SABZA_VALIDATOR_ROLE, msg.sender), "Not authorized SABZA validator");
        _;
    }
    
    modifier onlyBitbondIssuer() {
        require(hasRole(BITBOND_ISSUER_ROLE, msg.sender), "Not authorized Bitbond issuer");
        _;
    }
    
    // Step 1: Project Owner submits metadata
    function submitProject(
        string memory _projectId,
        string memory _ipfsCID,
        string memory _expectedSHA256Hash,
        string memory _tokenSymbol,
        string memory _metadata
    ) external onlyProjectOwner {
        require(bytes(projects[_projectId].projectId).length == 0, "Project already exists");
        
        projects[_projectId] = Project({
            projectId: _projectId,
            ipfsCID: _ipfsCID,
            expectedSHA256Hash: _expectedSHA256Hash,
            actualSHA256Hash: "",
            tokenSymbol: _tokenSymbol,
            projectOwner: msg.sender,
            sabzaValidator: address(0),
            status: ValidationStatus.Pending,
            submissionTimestamp: block.timestamp,
            validationTimestamp: 0,
            tokenizationTimestamp: 0,
            metadata: _metadata,
            isReadyForBitbond: false
        });
        
        projectIds.push(_projectId);
        
        emit ProjectSubmitted(_projectId, _ipfsCID, msg.sender, _expectedSHA256Hash, block.timestamp);
    }
    
    // Step 2-4: SABZA downloads, hashes, compares, and validates
    function sabzaValidateProject(
        string memory _projectId,
        string memory _actualSHA256Hash,
        bytes memory _signature
    ) external onlySABZAValidator {
        Project storage project = projects[_projectId];
        require(bytes(project.projectId).length > 0, "Project not found");
        require(project.status == ValidationStatus.Pending, "Project not in pending status");
        
        // Verify signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(_projectId, project.ipfsCID, _actualSHA256Hash)
        );
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recovered = ethSignedMessageHash.recover(_signature);
        require(recovered == msg.sender, "Invalid SABZA signature");
        
        project.actualSHA256Hash = _actualSHA256Hash;
        project.sabzaValidator = msg.sender;
        project.validationTimestamp = block.timestamp;
        
        // Compare hashes
        bool isValid = keccak256(abi.encodePacked(project.expectedSHA256Hash)) == 
                      keccak256(abi.encodePacked(_actualSHA256Hash));
        
        if (isValid) {
            project.status = ValidationStatus.SABZAValidated;
            project.isReadyForBitbond = true;
            tokenToProject[project.tokenSymbol] = _projectId;
            
            emit ProjectReadyForTokenization(_projectId, project.tokenSymbol, block.timestamp);
        } else {
            project.status = ValidationStatus.Rejected;
        }
        
        emit SABZAValidationCompleted(_projectId, _actualSHA256Hash, msg.sender, isValid, block.timestamp);
    }
    
    // Step 5: Bitbond marks project as tokenized
    function markAsTokenized(string memory _projectId) external onlyBitbondIssuer {
        Project storage project = projects[_projectId];
        require(project.status == ValidationStatus.SABZAValidated, "Project not SABZA validated");
        require(project.isReadyForBitbond, "Project not ready for tokenization");
        
        project.status = ValidationStatus.Tokenized;
        project.tokenizationTimestamp = block.timestamp;
        
        emit ProjectTokenized(_projectId, project.tokenSymbol, msg.sender, block.timestamp);
    }
    
    // Dashboard query functions for investors
    function getProjectByToken(string memory _tokenSymbol) 
        external view returns (Project memory) {
        string memory projectId = tokenToProject[_tokenSymbol];
        require(bytes(projectId).length > 0, "Token not found");
        return projects[projectId];
    }
    
    function getProject(string memory _projectId) 
        external view returns (Project memory) {
        require(bytes(projects[_projectId].projectId).length > 0, "Project not found");
        return projects[_projectId];
    }
    
    function getAllValidatedProjects() external view returns (Project[] memory) {
        uint256 count = 0;
        
        // Count validated projects
        for (uint i = 0; i < projectIds.length; i++) {
            ValidationStatus status = projects[projectIds[i]].status;
            if (status == ValidationStatus.SABZAValidated || status == ValidationStatus.Tokenized) {
                count++;
            }
        }
        
        Project[] memory result = new Project[](count);
        uint256 index = 0;
        
        for (uint i = 0; i < projectIds.length; i++) {
            ValidationStatus status = projects[projectIds[i]].status;
            if (status == ValidationStatus.SABZAValidated || status == ValidationStatus.Tokenized) {
                result[index] = projects[projectIds[i]];
                index++;
            }
        }
        
        return result;
    }
    
    function getProjectsByStatus(ValidationStatus _status) 
        external view returns (Project[] memory) {
        uint256 statusCount = 0;
        
        for (uint i = 0; i < projectIds.length; i++) {
            if (projects[projectIds[i]].status == _status) {
                statusCount++;
            }
        }
        
        Project[] memory statusProjects = new Project[](statusCount);
        uint256 currentIndex = 0;
        
        for (uint i = 0; i < projectIds.length; i++) {
            if (projects[projectIds[i]].status == _status) {
                statusProjects[currentIndex] = projects[projectIds[i]];
                currentIndex++;
            }
        }
        
        return statusProjects;
    }
    
    // Proof verification for dashboard
    function verifyProjectProof(string memory _projectId) 
        external view returns (
            bool isValid,
            string memory ipfsCID,
            string memory expectedHash,
            string memory actualHash,
            address sabzaValidator,
            ValidationStatus status
        ) {
        Project storage project = projects[_projectId];
        require(bytes(project.projectId).length > 0, "Project not found");
        
        return (
            project.status == ValidationStatus.SABZAValidated || project.status == ValidationStatus.Tokenized,
            project.ipfsCID,
            project.expectedSHA256Hash,
            project.actualSHA256Hash,
            project.sabzaValidator,
            project.status
        );
    }
    
    // Admin functions
    function addSABZAValidator(address _validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SABZA_VALIDATOR_ROLE, _validator);
    }
    
    function addBitbondIssuer(address _issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(BITBOND_ISSUER_ROLE, _issuer);
    }
    
    function addProjectOwner(address _owner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PROJECT_OWNER_ROLE, _owner);
    }
}