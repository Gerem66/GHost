const url = 'https://geremy.dev/GHost';

let dirName;

let el_contentMain = document.getElementById('drop');
let el_contentUpload = document.getElementById('content-upload');
let el_files = document.getElementById('files');
let el_listFiles = document.getElementById('list-files');
let el_link = document.getElementById('link');
let in_password = document.getElementById('password');
let in_triggerFile = document.getElementById('triggerFile');
let bt_getLink = document.getElementById('bt-get-link');
let bt_back = document.getElementById('bt-back');
let txt_link = document.getElementById('link-text');
let txt_clipboard = document.getElementById('clipboard-text');

let ZipFile = document.getElementById('file--zip');
let el_downloadZip = document.getElementById('download-zip');

function handleFileSelect(evt) {
	let template = "";
	let files = [];

	// Files to template
	let allFiles = el_files.files;
	for (let f in allFiles) {
		let file = allFiles[f];
		if (file.type) {
			template += `<div class="file file--` + files.length + `">
							<div class="name" title="` + file.name + `"><span>` + file.name + `</span></div>
								<div class="progress"></div>
									<div class="done">
									<!a href="" target="_blank"-->
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000">
											<g><path id="path" d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z"</g>
										</svg>
									<!/a-->
									</div>
								</div>`;
			files.push(file);
		}
	}

	// Check Size
	limit = 128 // Mo
	for (let f in files) {
		let file = files[f];
		let size = file.size || f.fileSize;
		if (size > limit * 1000000) {
			template = "";
			alert("Files must not exceed " + limit + "MB each !");
		}
	}

	if (files.length > 20) {
		template = "";
		alert("Number of files exceeded (20).");
	}

	// No file : exit
	if (template == "")
		return;

	// Active upload template
	el_contentMain.classList.add('hidden');
	el_contentUpload.classList.add("hasFiles");
	bt_getLink.classList.add("active");
	bt_back.classList.add("active");
	in_password.classList.add("active");
	el_listFiles.innerHTML = template;

	// Upload
	var uploaded_file = 0;
	dirName = [...Array(8)].map(i=>(~~(Math.random()*26)).toString(26)).join('');

	for (let i in files) {
		let file = files[i];

		let form_data = new FormData();
		form_data.append('file', file);
		form_data.append('dir', dirName);
		
		let el_file = document.getElementsByClassName('file--' + String(i))[0];
		UploadRequestProgress('php/upload.php', form_data, function() {
			el_file.getElementsByClassName('progress')[0].style.backgroundSize = '100%';
			el_file.getElementsByClassName('progress')[0].classList.add('end');
			el_file.getElementsByClassName('done')[0].classList.add('anim');
			if (uploaded_file >= files.length - 1)
				AllFilesUploaded();
			uploaded_file++;
		}, function(pc) {
			// Progress
			el_file.getElementsByClassName('progress')[0].style.backgroundSize = pc + '% 100%';
			el_file.getElementsByClassName('progress')[0].setAttribute('data-pc', parseInt(pc) + '%');
		});
	}

	function AllFilesUploaded() {
		// Start Zip upload
		el_downloadZip.classList.remove('inactive');
		el_downloadZip.classList.add('active');

		let form_data = new FormData();
		form_data.append('dir', dirName);
		form_data.append('zip', '1');

		UploadRequestProgress('php/upload.php', form_data, function() {
			ZipFile.getElementsByClassName('progress')[0].style.backgroundSize = '100%';
			ZipFile.getElementsByClassName('progress')[0].classList.add('end');
			ZipFile.getElementsByClassName('done')[0].classList.add('anim');
			bt_getLink.disabled = false;
		}, function(pc) {
			// Progress
			ZipFile.getElementsByClassName('progress')[0].style.backgroundSize = pc + '%';
			ZipFile.getElementsByClassName('progress')[0].setAttribute('data-pc', parseInt(pc) + '%');
		});
	}
}

// Trigger input
in_triggerFile.addEventListener('click', evt => {
	evt.preventDefault();
	el_files.click();
});

// Drag & Drop Events
el_contentMain.ondragleave = evt => {
	el_contentMain.classList.remove('active');
	evt.preventDefault();
};
el_contentMain.ondragover = el_contentMain.ondragenter = evt => {
	el_contentMain.classList.add('active');
	evt.preventDefault();
};
el_contentMain.ondrop = evt => {
	el_files.files = evt.dataTransfer.files;
	el_contentMain.classList.remove('active');
	handleFileSelect();
	evt.preventDefault();
};

// Back
bt_back.addEventListener('click', () => {
	if (bt_getLink.disabled) location.reload();
	el_listFiles.innerHTML = '';
	el_contentUpload.classList.remove('hasFiles');
	bt_getLink.classList.remove('active');
	bt_back.classList.remove('active');
	in_password.classList.remove('active');
	in_password.value = '';
	el_link.classList.add('hidden');
	bt_getLink.disabled = true;

	ZipFile.getElementsByClassName('done')[0].classList.remove('anim');
	ZipFile.getElementsByClassName('progress')[0].style.backgroundSize = '0%';
	setTimeout(() => el_contentMain.classList.remove('hidden'), 500);
});

// Get link
bt_getLink.addEventListener('click', () => {
	el_listFiles.innerHTML = '';
	el_contentUpload.classList.remove('hasFiles');
	bt_getLink.classList.remove('active');
	bt_back.classList.remove('active');
	in_password.classList.remove('active');
	el_link.classList.remove('hidden');
	txt_link.innerHTML = url + '/' + dirName;
	txt_link.addEventListener('click', () => {
		navigator.clipboard.writeText(url + '/' + dirName);
		txt_clipboard.style.display = 'block';
		setTimeout(() => txt_link.href = url + '/' + dirName, 500);
	});

	let form_data = new FormData();
	form_data.append('dir', dirName);
	form_data.append('generate', '1');
	form_data.append('password', in_password.value);
	UploadRequest('php/upload.php', form_data);
});

// Input change
el_files.addEventListener('change', handleFileSelect);
bt_getLink.disabled = true;
