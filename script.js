let currentTool = '';
let selectedFiles = [];
let processedFiles = [];

const toolCards = document.querySelectorAll('.tool-card');
const uploadSection = document.getElementById('upload-section');
const toolsSection = document.querySelector('.tools-section');
const backButton = document.getElementById('back-button');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const compressButton = document.getElementById('compress-button');
const uploadTitle = document.getElementById('upload-title');
const supportedFormats = document.getElementById('supported-formats');
const qualitySelector = document.getElementById('quality-selector');
const qualitySlider = document.getElementById('quality-slider');
const qualityValue = document.getElementById('quality-value');

toolCards.forEach(card => {
    card.addEventListener('click', () => {
        currentTool = card.dataset.tool;
        showUploadSection();
    });
});

backButton.addEventListener('click', () => {
    hideUploadSection();
    resetUploadState();
});

function showUploadSection() {
    toolsSection.style.display = 'none';
    uploadSection.style.display = 'block';
    
    switch(currentTool) {
        case 'image':
            uploadTitle.textContent = 'Compress Your Images';
            supportedFormats.textContent = 'Supported formats: PNG, JPG, JPEG, GIF, WebP';
            fileInput.accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';
            qualitySelector.style.display = 'block';
            break;
        case 'pdf':
            uploadTitle.textContent = 'Compress Your PDFs';
            supportedFormats.textContent = 'Supported formats: PDF';
            fileInput.accept = 'application/pdf';
            qualitySelector.style.display = 'none';
            break;
        case 'archive':
            uploadTitle.textContent = 'Create ZIP Archive';
            supportedFormats.textContent = 'Upload any files to create a ZIP archive';
            fileInput.accept = '*';
            qualitySelector.style.display = 'none';
            break;
    }
    
    uploadSection.scrollIntoView({ behavior: 'smooth' });
}

function hideUploadSection() {
    uploadSection.style.display = 'none';
    toolsSection.style.display = 'block';
    toolsSection.scrollIntoView({ behavior: 'smooth' });
}

function resetUploadState() {
    selectedFiles = [];
    processedFiles = [];
    fileList.innerHTML = '';
    compressButton.style.display = 'none';
    fileInput.value = '';
}

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
});

qualitySlider.addEventListener('input', (e) => {
    const value = Math.round(e.target.value * 100);
    qualityValue.textContent = value + '%';
});

function handleFiles(files) {
    if (currentTool === 'image') {
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            showNotification('Some files were filtered out. Only image files are supported.', 'warning');
        }
        selectedFiles = validFiles;
    } else if (currentTool === 'pdf') {
        const validFiles = files.filter(file => file.type === 'application/pdf');
        if (validFiles.length !== files.length) {
            showNotification('Only PDF files are supported.', 'warning');
        }
        selectedFiles = validFiles;
    } else {
        selectedFiles = files;
    }
    
    if (selectedFiles.length > 0) {
        displayFiles();
        compressButton.style.display = 'block';
    } else {
        showNotification('No valid files selected.', 'error');
    }
}

function displayFiles() {
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileExt = file.name.split('.').pop().toUpperCase();
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${fileExt}</div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">Original: ${formatFileSize(file.size)}</div>
                    <div class="file-progress" style="display: none;">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="file-actions">
                <button class="remove-button" onclick="removeFile(${index})">×</button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    processedFiles.splice(index, 1);
    displayFiles();
    
    if (selectedFiles.length === 0) {
        compressButton.style.display = 'none';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#f5576c' : type === 'warning' ? '#f093fb' : '#4facfe'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

compressButton.addEventListener('click', async () => {
    compressButton.disabled = true;
    compressButton.textContent = 'Compressing...';
    
    processedFiles = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileItems = fileList.children;
        const progressBar = fileItems[i].querySelector('.progress-bar');
        const progressContainer = fileItems[i].querySelector('.file-progress');
        const fileSizeElement = fileItems[i].querySelector('.file-size');
        
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        
        try {
            let compressedFile;
            
            if (currentTool === 'image') {
                progressBar.style.width = '30%';
                compressedFile = await compressImage(file, parseFloat(qualitySlider.value));
                progressBar.style.width = '100%';
            } else if (currentTool === 'pdf') {
                progressBar.style.width = '30%';
                compressedFile = await compressPDF(file);
                progressBar.style.width = '100%';
            } else if (currentTool === 'archive') {
                compressedFile = file;
                progressBar.style.width = '100%';
            }
            
            processedFiles.push(compressedFile);
            
            const originalSize = file.size;
            const compressedSize = compressedFile.size;
            const reduction = originalSize > compressedSize ? Math.round((1 - compressedSize / originalSize) * 100) : 0;
            
            if (reduction > 0) {
                fileSizeElement.innerHTML = `
                    Original: ${formatFileSize(originalSize)} → 
                    Compressed: ${formatFileSize(compressedSize)} 
                    <span style="color: #4facfe;">(${reduction}% smaller)</span>
                `;
            } else {
                fileSizeElement.innerHTML = `
                    Size: ${formatFileSize(compressedSize)}
                    <span style="color: #a0aec0;">(Optimized)</span>
                `;
            }
            
            const actionsDiv = fileItems[i].querySelector('.file-actions');
            actionsDiv.innerHTML = `
                <button class="download-button" onclick="downloadFile(${i})">Download</button>
                <button class="remove-button" onclick="removeFile(${i})">×</button>
            `;
            
        } catch (error) {
            console.error('Compression error:', error);
            fileSizeElement.innerHTML += '<span style="color: #f5576c;"> (Error: ' + error.message + ')</span>';
            progressBar.style.width = '100%';
            progressBar.style.background = '#f5576c';
        }
    }
    
    if (currentTool === 'archive' && selectedFiles.length > 1) {
        try {
            const zipFile = await createZipArchive(selectedFiles);
            processedFiles = [zipFile];
            fileList.innerHTML = '';
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">ZIP</div>
                    <div class="file-details">
                        <div class="file-name">archive.zip</div>
                        <div class="file-size">Size: ${formatFileSize(zipFile.size)} (${selectedFiles.length} files)</div>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="download-button" onclick="downloadFile(0)">Download</button>
                </div>
            `;
            fileList.appendChild(fileItem);
        } catch (error) {
            console.error('ZIP creation error:', error);
            showNotification('Error creating ZIP archive: ' + error.message, 'error');
        }
    }
    
    compressButton.textContent = currentTool === 'archive' ? 'Create ZIP' : 'Compress Files';
    compressButton.disabled = false;
    
    if (processedFiles.length > 0) {
        showNotification('Processing complete! Click Download to save your files.', 'info');
    }
});

async function compressImage(file, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                const maxDimension = 2048;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Canvas conversion failed'));
                    }
                }, 'image/jpeg', quality);
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

async function compressPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        
        const pages = pdfDoc.getPages();
        
        for (const page of pages) {
            const { width, height } = page.getSize();
            
            if (width > 1200 || height > 1200) {
                const scale = Math.min(1200 / width, 1200 / height);
                page.scale(scale, scale);
            }
        }
        
        const compressedPdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
        });
        
        const compressedFile = new File([compressedPdfBytes], file.name, {
            type: 'application/pdf',
            lastModified: Date.now()
        });
        
        return compressedFile;
    } catch (error) {
        console.error('PDF compression error:', error);
        return file;
    }
}

async function createZipArchive(files) {
    const zip = new JSZip();
    
    for (const file of files) {
        zip.file(file.name, file);
    }
    
    const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    });
    
    return new File([zipBlob], 'archive.zip', {
        type: 'application/zip',
        lastModified: Date.now()
    });
}

function downloadFile(index) {
    const file = processedFiles[index];
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.startsWith('compressed_') ? file.name : 'compressed_' + file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
