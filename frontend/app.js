// Dynamic API URL detection
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : `${window.location.origin}/api`;

let currentTab = 'search';

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
    
    currentTab = tabName;
    
    // Load appropriate content
    if (tabName === 'validated') {
        loadValidatedProjects();
    } else if (tabName === 'pending') {
        loadPendingProjects();
    } else if (tabName === 'verify') {
        // Clear the verification form
        document.getElementById('verifyProjectId').value = '';
        document.getElementById('verifyIpfsUrl').value = '';
        document.getElementById('verifySha256Hash').value = '';
    }
    
    // Clear results when switching tabs
    document.getElementById('results').innerHTML = '';
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const result = await response.json();
        
        if (result.success) {
            const statsGrid = document.getElementById('statsGrid');
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number" style="color: #667eea;">${result.data.total}</div>
                    <div class="stat-label">Total Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #ffc107;">${result.data.pending}</div>
                    <div class="stat-label">Pending Validation</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #17a2b8;">${result.data.validated}</div>
                    <div class="stat-label">SABZA Validated</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #28a745;">${result.data.tokenized}</div>
                    <div class="stat-label">Tokenized</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #dc3545;">${result.data.rejected}</div>
                    <div class="stat-label">Rejected</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function searchProject() {
    const tokenSymbol = document.getElementById('tokenInput').value.trim();
    if (!tokenSymbol) {
        showError('Please enter a token symbol');
        return;
    }
    
    showLoading('Searching for project...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/project/token/${tokenSymbol}`);
        const result = await response.json();
        
        if (result.success) {
            displayProject(result.data, `✅ Project found for token ${result.data.tokenSymbol}`);
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError('Error searching project: ' + error.message);
    }
}

async function searchProjectById() {
    const projectId = document.getElementById('projectInput').value.trim();
    if (!projectId) {
        showError('Please enter a project ID');
        return;
    }
    
    showLoading('Searching for project...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/project/${projectId}`);
        const result = await response.json();
        
        if (result.success) {
            displayProject(result.data, `✅ Project found: ${result.data.projectId}`);
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError('Error searching project: ' + error.message);
    }
}

async function loadValidatedProjects() {
    showLoading('Loading validated projects...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects/validated`);
        const result = await response.json();
        
        if (result.success) {
            displayAllProjects(result.data, '✅ SABZA Validated Projects');
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError('Error loading validated projects: ' + error.message);
    }
}

async function loadPendingProjects() {
    showLoading('Loading pending projects...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects/status/0`);
        const result = await response.json();
        
        if (result.success) {
            displayAllProjects(result.data, '⏳ Projects Pending SABZA Validation');
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError('Error loading pending projects: ' + error.message);
    }
}

async function verifyProjectProof(projectId) {
    showLoading(`Verifying blockchain proof for ${projectId}...`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/verify/${projectId}`);
        const result = await response.json();
        
        if (result.success) {
            displayProofVerification(result.data);
        } else {
            showError('Proof verification failed: ' + result.message);
        }
    } catch (error) {
        showError('Error verifying proof: ' + error.message);
    }
}

async function manualVerifyProject() {
    const projectId = document.getElementById('verifyProjectId').value.trim();
    const ipfsUrl = document.getElementById('verifyIpfsUrl').value.trim();
    const sha256Hash = document.getElementById('verifySha256Hash').value.trim();
    
    // Validate inputs
    if (!projectId) {
        showVerificationError('Please enter a Project ID');
        return;
    }
    
    if (!ipfsUrl) {
        showVerificationError('Please enter an IPFS URL or CID');
        return;
    }
    
    if (!sha256Hash) {
        showVerificationError('Please enter a SHA-256 hash');
        return;
    }
    
    // Extract CID from IPFS URL if needed
    let ipfsCID = ipfsUrl;
    if (ipfsUrl.startsWith('ipfs://')) {
        ipfsCID = ipfsUrl.replace('ipfs://', '');
    } else if (ipfsUrl.includes('ipfs/')) {
        ipfsCID = ipfsUrl.split('ipfs/')[1];
    }
    
    showVerificationLoading('Verifying project against smart contract...');
    
    try {
        // Use the manual verification API endpoint
        const response = await fetch(`${API_BASE_URL}/verify/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId,
                ipfsCID,
                sha256Hash
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            showVerificationError(`Verification failed: ${result.message}`);
            return;
        }
        
        const { verification, allMatch, project } = result.data;
        
        displayManualVerificationResult(project, verification, {
            projectId,
            ipfsCID,
            sha256Hash
        }, allMatch);
        
    } catch (error) {
        showVerificationError('Error verifying project: ' + error.message);
    }
}

function displayProject(project, successMessage) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="success">${successMessage}</div>
        ${createProjectCard(project)}
    `;
}

function displayAllProjects(projects, title) {
    const resultsDiv = document.getElementById('results');
    
    if (projects.length === 0) {
        resultsDiv.innerHTML = `<div class="error">No projects found for ${title}</div>`;
        return;
    }
    
    resultsDiv.innerHTML = `
        <div class="success">📊 ${title} (${projects.length} found)</div>
        ${projects.map(createProjectCard).join('')}
    `;
}

function displayProofVerification(proof) {
    // Check if hashes match
    const hashesMatch = proof.expectedHash && proof.actualHash && 
                       proof.expectedHash.toLowerCase() === proof.actualHash.toLowerCase();
    
    const proofHtml = `
        <div class="proof-section">
            <h3>🔐 Blockchain Proof Verification Results</h3>
            <div class="project-details">
                <div class="detail-item">
                    <div class="detail-label">Verification Status</div>
                    <div class="detail-value">
                        ${proof.isValid ? 
                            '<span style="color: #28a745; font-weight: bold;">✅ VERIFIED</span>' : 
                            '<span style="color: #dc3545; font-weight: bold;">❌ FAILED</span>'
                        }
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">SABZA Validator</div>
                    <div class="detail-value">${proof.sabzaValidator}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Project Status</div>
                    <div class="detail-value">${proof.status}</div>
                </div>
                
                <!-- Hash Comparison Section -->
                <div class="hash-comparison ${hashesMatch ? '' : 'hash-mismatch'}">
                    <div class="detail-item">
                        <div class="detail-label">Expected Hash (Project Owner)</div>
                        <div class="detail-value hash-value expected-hash" style="font-family: monospace; font-size: 12px; word-break: break-all;">
                            ${proof.expectedHash || 'Not available'}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Actual Hash (SABZA Calculated)</div>
                        <div class="detail-value hash-value actual-hash" style="font-family: monospace; font-size: 12px; word-break: break-all;">
                            ${proof.actualHash || 'Not calculated yet'}
                        </div>
                    </div>
                    
                    <!-- Hash Match Status -->
                    ${proof.expectedHash && proof.actualHash ? `
                        <div class="hash-match-status" style="margin: 15px 0; padding: 15px; border-radius: 10px; ${hashesMatch ? 'background: #d4edda; border: 2px solid #28a745;' : 'background: #f8d7da; border: 2px solid #dc3545;'}">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 24px;">${hashesMatch ? '✅' : '⚠️'}</span>
                                <div>
                                    <strong style="color: ${hashesMatch ? '#155724' : '#721c24'};">
                                        ${hashesMatch ? 'HASH VERIFICATION SUCCESSFUL' : 'HASH MISMATCH DETECTED!'}
                                    </strong>
                                    <div style="margin-top: 5px; font-size: 14px; color: ${hashesMatch ? '#155724' : '#721c24'};">
                                        ${hashesMatch ? 
                                            'The document integrity has been verified. Expected and actual hashes match perfectly.' : 
                                            'WARNING: The document may have been modified! Expected and actual hashes do not match.'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">IPFS Document</div>
                    <div class="detail-value">
                        <a href="${proof.ipfsUrl}" target="_blank" class="ipfs-link">${proof.ipfsCID}</a>
                    </div>
                </div>
            </div>
            
            <!-- Overall Status Section -->
            <div style="margin-top: 15px; padding: 15px; background: ${proof.isValid && hashesMatch ? '#d4edda' : '#f8d7da'}; border-radius: 10px;">
                <strong style="color: ${proof.isValid && hashesMatch ? '#155724' : '#721c24'};">
                    ${proof.isValid && hashesMatch ? '✅ Cryptographic Proof Valid' : '❌ Proof Verification Failed'}
                </strong><br>
                <div style="margin-top: 8px; font-size: 14px;">
                    ${proof.isValid && hashesMatch ? 
                        'This project has been cryptographically validated by SABZA and stored immutably on the Ethereum blockchain. The document integrity is confirmed.' :
                        proof.isValid ? 
                            'Project is marked as valid on blockchain, but hash verification should be checked for document integrity.' :
                            'This project failed cryptographic validation. The document may have been tampered with or validation is incomplete.'
                    }
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('results').innerHTML = proofHtml;
}

function displayManualVerificationResult(project, verification, inputData, allMatch) {
    const isValidated = project.status === 'SABZAValidated' || project.status === 'Tokenized';
    
    let resultClass = allMatch ? 'verification-success' : 'verification-error';
    let resultIcon = allMatch ? '✅' : '❌';
    let resultTitle = allMatch ? 'VERIFICATION SUCCESSFUL!' : 'VERIFICATION FAILED!';
    
    const resultHtml = `
        <div class="verification-result ${resultClass}">
            <h3>${resultIcon} ${resultTitle}</h3>
            
            <div style="margin: 20px 0;">
                <div><strong>Project Status:</strong> ${project.status}</div>
                <div><strong>SABZA Validated:</strong> ${isValidated ? 'Yes' : 'No'}</div>
            </div>
            
            <div style="margin: 20px 0;">
                <h4>🔍 Verification Details:</h4>
                <div style="font-family: monospace; font-size: 14px; margin: 10px 0;">
                    ${createVerificationItem('Project ID', verification.projectIdMatch, inputData.projectId, project.projectId)}
                    ${createVerificationItem('IPFS CID', verification.ipfsCIDMatch, inputData.ipfsCID, project.ipfsCID)}
                    ${createVerificationItem('Expected Hash', verification.expectedHashMatch, inputData.sha256Hash, project.expectedSHA256Hash)}
                    ${project.actualSHA256Hash ? createVerificationItem('Actual Hash', verification.actualHashMatch, inputData.sha256Hash, project.actualSHA256Hash) : ''}
                </div>
            </div>
            
            ${allMatch ? `
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px;">
                    <strong>🎉 Project verified successfully!</strong><br>
                    All provided data matches the blockchain records. This project has been validated by SABZA.
                </div>
            ` : `
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px;">
                    <strong>⚠️ Verification failed!</strong><br>
                    The provided data does not match the blockchain records. Please check your inputs.
                </div>
            `}
            
            <div style="margin-top: 20px;">
                <button onclick="viewFullProject('${project.projectId}')" class="btn btn-primary" style="margin-right: 10px;">
                    View Full Project Details
                </button>
                <a href="${project.ipfsUrl}" target="_blank" class="btn btn-verify" style="margin-right: 10px;">
                    View IPFS Document
                </a>
                <a href="https://sepolia.etherscan.io/address/0x058976FD969398b868C2D88d9193B16Ad458aC67" target="_blank" class="btn btn-verify">
                    🔗 Verify on Blockchain Explorer
                </a>
            </div>
        </div>
    `;
    
    document.getElementById('results').innerHTML = resultHtml;
}

function createVerificationItem(label, isMatch, provided, blockchain) {
    const icon = isMatch ? '✅' : '❌';
    const color = isMatch ? '#28a745' : '#dc3545';
    
    // Add blockchain explorer links for hash verification
    let blockchainDisplay = blockchain || 'Not available';
    if (label.includes('Hash') && blockchain && blockchain.length > 10) {
        // For SOLAR24 project, show link to specific transaction
        const txLink = label.includes('Expected') ? 
            'https://sepolia.etherscan.io/tx/0xfaa4e96b90fa05747df6d231c8ed6fb10d693d325cfa889ba4c91f48cd3ca80f' :
            'https://sepolia.etherscan.io/tx/0x26b1f916d2448a6ea522723a8adcbb1fdc36aac2d918645ea7a46fc91c02b95b';
        
        blockchainDisplay = `
            <div style="font-family: monospace; font-size: 11px; word-break: break-all;">${blockchain}</div>
            <div style="margin-top: 5px;">
                <a href="${txLink}" target="_blank" style="color: #007bff; font-size: 12px; text-decoration: none;">
                    🔗 View on Sepolia Explorer
                </a>
            </div>
        `;
    }
    
    return `
        <div style="margin: 15px 0; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 5px;">
            <div style="color: ${color}; font-weight: bold;">${icon} ${label}</div>
            <div style="margin: 5px 0;">
                <div><strong>Provided:</strong> <span style="font-family: monospace; font-size: 11px;">${provided || 'Not provided'}</span></div>
                <div><strong>Blockchain:</strong> ${blockchainDisplay}</div>
            </div>
        </div>
    `;
}

function viewFullProject(projectId) {
    // Switch to search tab and load the project
    document.getElementById('projectInput').value = projectId;
    switchTab('search');
    searchProjectById();
}

function createProjectCard(project) {
    const metadata = project.metadata || {};
    const statusClass = `status-${project.status.toLowerCase().replace(/\s+/g, '')}`;
    
    // Check if hashes match for validated projects
    const hashesMatch = project.expectedSHA256Hash && project.actualSHA256Hash && 
                       project.expectedSHA256Hash.toLowerCase() === project.actualSHA256Hash.toLowerCase();
    const hasHashData = project.expectedSHA256Hash && project.actualSHA256Hash;
    
    return `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${metadata.name || 'Unnamed Project'}</h3>
                <div class="badges">
                    <span class="token-badge">${project.tokenSymbol}</span>
                    <span class="status-badge ${statusClass}">${project.status}</span>
                    ${project.isReadyForBitbond ? '<span class="status-badge" style="background: #6f42c1; color: white;">Ready for Bitbond</span>' : ''}
                    ${hasHashData ? (hashesMatch ? 
                        '<span class="status-badge hash-verified">✅ Hash Verified</span>' : 
                        '<span class="status-badge hash-mismatch">⚠️ Hash Mismatch</span>'
                    ) : ''}
                </div>
            </div>
            
            <!-- Hash Mismatch Warning for validated projects -->
            ${hasHashData && !hashesMatch ? `
                <div class="hash-mismatch-warning" style="margin: 15px 0; padding: 15px; background: #f8d7da; border: 2px solid #dc3545; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">⚠️</span>
                        <div>
                            <strong style="color: #721c24;">HASH MISMATCH DETECTED!</strong>
                            <div style="margin-top: 5px; font-size: 14px; color: #721c24;">
                                The expected hash doesn't match the SABZA-calculated hash. This indicates the document may have been modified after submission.
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <p><strong>Description:</strong> ${metadata.description || 'No description available'}</p>
            
            <div class="project-details">
                <div class="detail-item">
                    <div class="detail-label">Project ID</div>
                    <div class="detail-value">${project.projectId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Project Owner</div>
                    <div class="detail-value">${project.projectOwner}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Submission Date</div>
                    <div class="detail-value">${project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : 'N/A'}</div>
                </div>
                ${project.sabzaValidator !== '0x0000000000000000000000000000000000000000' ? `
                    <div class="detail-item">
                        <div class="detail-label">SABZA Validator</div>
                        <div class="detail-value">${project.sabzaValidator}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Validation Date</div>
                        <div class="detail-value">${project.validationDate ? new Date(project.validationDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                ` : ''}
                ${project.tokenizationDate ? `
                    <div class="detail-item">
                        <div class="detail-label">Tokenization Date</div>
                        <div class="detail-value">${new Date(project.tokenizationDate).toLocaleDateString()}</div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Hash Comparison Section -->
            ${hasHashData ? `
                <div class="hash-comparison-section" style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                    <h4 style="margin: 0 0 10px 0; color: #495057;">🔐 Hash Comparison</h4>
                    <div class="detail-item">
                        <div class="detail-label">Expected Hash (Owner)</div>
                        <div class="detail-value" style="font-family: monospace; font-size: 11px; word-break: break-all; color: #007bff;">
                            ${project.expectedSHA256Hash}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Actual Hash (SABZA)</div>
                        <div class="detail-value" style="font-family: monospace; font-size: 11px; word-break: break-all; color: ${hashesMatch ? '#28a745' : '#dc3545'};">
                            ${project.actualSHA256Hash}
                        </div>
                    </div>
                    <div style="margin-top: 10px; padding: 10px; background: ${hashesMatch ? '#d4edda' : '#f8d7da'}; border-radius: 5px;">
                        <small style="color: ${hashesMatch ? '#155724' : '#721c24'}; font-weight: bold;">
                            ${hashesMatch ? '✅ Hashes Match - Document Integrity Verified' : '❌ Hashes Don\'t Match - Potential Document Modification'}
                        </small>
                    </div>
                </div>
            ` : ''}
            
            <div class="proof-section">
                <div class="proof-header">
                    <h4>🔐 Blockchain Verification</h4>
                    <button onclick="verifyProjectProof('${project.projectId}')" class="btn btn-verify">
                        Verify Proof on Blockchain
                    </button>
                </div>
                <div class="detail-item">
                    <div class="detail-label">IPFS Document</div>
                    <div class="detail-value">
                        <a href="${project.ipfsUrl}" target="_blank" class="ipfs-link">${project.ipfsCID}</a>
                    </div>
                </div>
                ${project.expectedSHA256Hash ? `
                    <div class="detail-item">
                        <div class="detail-label">Document Hash (SHA-256)</div>
                        <div class="detail-value" style="font-family: monospace; font-size: 12px;">${project.expectedSHA256Hash}</div>
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 15px; font-size: 12px; color: #666; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <p><strong>🔗 Blockchain Security:</strong> This project is secured on Ethereum Sepolia testnet</p>
                <p><strong>🔍 SABZA Validation:</strong> Independent third-party validation with cryptographic proof</p>
                <p><strong>💎 Bitbond Integration:</strong> ${project.isReadyForBitbond ? 'Ready for tokenization' : 'Awaiting validation completion'}</p>
                ${hasHashData ? `<p><strong>🔐 Hash Verification:</strong> ${hashesMatch ? 'Document integrity confirmed' : 'Hash mismatch detected - review required'}</p>` : ''}
            </div>
        </div>
    `;
}

function showError(message) {
    document.getElementById('results').innerHTML = `<div class="error">❌ ${message}</div>`;
}

function showLoading(message) {
    document.getElementById('results').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            ⏳ ${message}
        </div>
    `;
}

function showVerificationError(message) {
    document.getElementById('results').innerHTML = `
        <div class="verification-result verification-error">
            <h3>❌ Verification Error</h3>
            <p>${message}</p>
        </div>
    `;
}

function showVerificationLoading(message) {
    document.getElementById('results').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            🔍 ${message}
        </div>
    `;
}

// Event listeners for Enter key
document.getElementById('tokenInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProject();
    }
});

document.getElementById('projectInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProjectById();
    }
});

// Add Enter key listeners for verification form
document.addEventListener('DOMContentLoaded', function() {
    const verifyInputs = ['verifyProjectId', 'verifyIpfsUrl', 'verifySha256Hash'];
    
    verifyInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    manualVerifyProject();
                }
            });
        }
    });
});

// Load initial data
window.addEventListener('load', () => {
    loadStats();
    // Refresh stats every 30 seconds
    setInterval(loadStats, 30000);
});