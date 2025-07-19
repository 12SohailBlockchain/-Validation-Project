const API_BASE_URL = 'http://localhost:3000/api';

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
                <div class="detail-item">
                    <div class="detail-label">Expected Hash</div>
                    <div class="detail-value" style="font-family: monospace; font-size: 12px;">${proof.expectedHash}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Actual Hash (SABZA)</div>
                    <div class="detail-value" style="font-family: monospace; font-size: 12px;">${proof.actualHash}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">IPFS Document</div>
                    <div class="detail-value">
                        <a href="${proof.ipfsUrl}" target="_blank" class="ipfs-link">${proof.ipfsCID}</a>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: ${proof.isValid ? '#d4edda' : '#f8d7da'}; border-radius: 10px;">
                <strong>${proof.isValid ? '✅ Cryptographic Proof Valid' : '❌ Proof Verification Failed'}</strong><br>
                ${proof.isValid ? 
                    'This project has been cryptographically validated by SABZA and stored immutably on the Ethereum blockchain.' :
                    'This project failed cryptographic validation. The document may have been tampered with.'
                }
            </div>
        </div>
    `;
    
    document.getElementById('results').innerHTML = proofHtml;
}

function createProjectCard(project) {
    const metadata = project.metadata || {};
    const statusClass = `status-${project.status.toLowerCase().replace(/\s+/g, '')}`;
    
    return `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${metadata.name || 'Unnamed Project'}</h3>
                <div class="badges">
                    <span class="token-badge">${project.tokenSymbol}</span>
                    <span class="status-badge ${statusClass}">${project.status}</span>
                    ${project.isReadyForBitbond ? '<span class="status-badge" style="background: #6f42c1; color: white;">Ready for Bitbond</span>' : ''}
                </div>
            </div>
            
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

// Load initial data
window.addEventListener('load', () => {
    loadStats();
    // Refresh stats every 30 seconds
    setInterval(loadStats, 30000);
});