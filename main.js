const promptForm = document.querySelector(".prompt-form");
const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container")
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggle = document.querySelector("#theme-toggle-btn");

let lastResponseWasImage = false;
let typingInterval, controller;
const API_KEY = "AIzaSyBGOI91wjcqJdWCEojPQIRxHkv-EBxOPw0"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`
const userData = {message: "", file: {}};
const chatHistory = [];

const createMsgElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

const aiResponses = {
  "siapa nama kamu": "Nama saya Neuxon AI",
  "siapa namamu": "Nama saya Neuxon AI",
  "apakah kamu chatgpt": "Saya bukan ChatGPT, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
    "apakah kamu neuxon?": "Ya, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
    "kamu neuxon?": "Ya, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
    " kamu neuxon ai?": "Ya, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
    "apakah kamu neuxon ai?": "Ya, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "apakah kamu meta ai": "Saya bukan ChatGPT, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "apakah kamu deepseek ai": "Saya bukan ChatGPT, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "apakah kamu ngrok ai": "Saya bukan ChatGPT, Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "kamu Chatgpt bukan": "Halo! Saya bukan ChatGPT, tetapi saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "kamu chatgpt bukan": "Halo! Saya bukan ChatGPT, tetapi saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "apakah kamu gemini": "Ya, Saya bukan Gemini, tetapi saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations untuk menjadi teman mu dimana pun dan kapanpun :)",
  "gemini": "Halo! Saya bukan Gemini, tetapi saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibangun oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "hai": "Hai! Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibuat oleh AdhiKarya Innovations, kamu bisa menganggapku sebagai teman virtual yang siap membantu kapan saja. Apa yang kamu ingin ketahui?",
  "halo": "Halo! Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibuat oleh AdhiKarya Innovations, kamu bisa menganggapku sebagai teman virtual yang siap membantu kapan saja. Apa yang kamu ingin ketahui?",
  "kamu ai": "Ya, aku adalah AI yang dirancang untuk membantu kamu dalam berbagai hal, seperti menjawab pertanyaan, memberikan panduan, atau hal lainnya, Ada yang bisa kubantu?",
  "Neuxon ai": "Halo, Aku Neuxon AI, ada yang bisa aku bantu?",
  "halo Neuxon ai": "Halo juga, Apa kabar nih? ada yang bisa aku bantu?",
  "apakah kamu ai": "Ya, aku adalah Neuxon AI yang dibuat oleh AdhiKarya Innovations untuk membantu kamu dalam berbagai hal, seperti menjawab pertanyaan, memberikan panduan, atau hal lainnya, Ada yang bisa kubantu?",
  "kamu ini ai": "Ya, aku adalah Neuxon AI yang dirancang untuk membantu kamu dalam berbagai hal, seperti menjawab pertanyaan, mengerjakan tugas, memberikan panduan, atau hal lainnya, Ada yang bisa kubantu?",
  "kamu ini apa": "Saya adalah Neuxon AI, dirancang untuk membantu kamu dalam berbagai hal, seperti menjawab pertanyaan, memberikan panduan, atau hal lainnya. Ada yang bisa kubantu?",
  "kamu ini siapa": "Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibuat oleh AdhiKarya Innovations, kamu bisa menganggapku sebagai teman virtual yang siap membantu kapan saja. Apa yang kamu ingin ketahui?",
  "halo namamu siapa": "Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibuat oleh AdhiKarya Innovations, kamu bisa menganggapku sebagai teman virtual yang siap membantu kapan saja. Apa yang kamu ingin ketahui?",
  "siapa sih kamu": "Saya adalah Neuxon AI, asisten berbasis kecerdasan buatan yang dibuat oleh AdhiKarya Innovations, Apa yang kamu ingin ketahui?",
  "kamu dibuat oleh siapa": "Saya dikembangkan oleh AdhiKarya Innovations sebagai Neuxon AI, yang diciptakan dengan hati.",
  "terimakasih": "sama sama, jika perlu bantuan lagi tanya aku saja!",
  "kamu dirancang oleh siapa": "Saya dirancang oleh siswa SMK bernama Januar Adhi N sebagai Neuxon AI, yang diciptakan dengan hati.",
  "terimakasih Neuxon ai": "sama sama, jika perlu bantuan tanya aku saja!",
  "oke Neuxon ai": "siap!, jika perlu bantuan lagi tanya aku saja!",
  "terimakasih Neuxon": "Sama-sama. Saya senang bisa membantu. Jika kamu memiliki pertanyaan atau membutuhkan bantuan lagi, jangan ragu untuk bertanya.",
  "kamu dibuat sama siapa": "Saya dikembangkan oleh AdhiKarya Innovations sebagai Neuxon AI untuk membantu kamu berbagai hal, Ada yang bisa aku bantu?",
  "terima kasih": "sama sama, jika perlu bantuan tanya aku saja!",
  "terima kasih Neuxon ai": "sama sama, jika perlu lagi bantuan tanya aku saja!",
  "terima kasih Neuxon": "Sama-sama. Saya senang bisa membantu. Jika kamu memiliki pertanyaan atau membutuhkan bantuan lagi, jangan ragu untuk bertanya.",
};

const scrollToBottom = () => container.scrollTo({top: container.scrollHeight, behavior: "smooth"});
 

const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.innerHTML = "";
  let wordIndex = 0;
  const words = text.split(" ");

  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      let word = words[wordIndex]
        .replace(/^\* /, "• ") // Bullet point
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") // Bold
        .replace(/\*(.+?)\*/g, "<i>$1</i>"); // Italic

      textElement.innerHTML += (wordIndex === 0 ? "" : " ") + word;
      wordIndex++;
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove("loading");
      document.body.classList.remove("bot-responding");

      // **Deteksi kode dan formatnya**
      formatCodeBlocks(textElement);
    }
  }, 40);
};

// Fungsi untuk mendeteksi dan memformat blok kode
const formatCodeBlocks = (textElement) => {
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;

  textElement.innerHTML = textElement.innerHTML.replace(codeRegex, (match, lang, code) => {
    return `
      <div class="code-container">
        <button class="copy-code-btn" onclick="copyCode(this)">Salin</button>
        <pre><code class="language-${lang || 'html'}">${code}</code></pre>
      </div>
    `;
  });

  // Pastikan elemen kode tidak dikonversi menjadi karakter entitas
  document.querySelectorAll("pre code").forEach((block) => {
    block.textContent = block.textContent; // Pastikan tetap sebagai teks asli
  });

  document.querySelectorAll(".copy-code-btn").forEach((btn) => {
    btn.addEventListener("click", () => copyCode(btn));
  });
};

// Fungsi untuk mencegah XSS dalam kode
const escapeHTML = (str) => {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Fungsi untuk menyalin kode ke clipboard
const copyCode = (btn) => {
  const codeElement = btn.nextElementSibling.querySelector("code");
  navigator.clipboard.writeText(codeElement.textContent).then(() => {
    btn.textContent = "Disalin!";
    setTimeout(() => (btn.textContent = "Salin"), 2000);
  }).catch(err => console.error("Gagal menyalin kode:", err));
};

const googleProductsWithoutGoogle = [
  "Search", "Assistant", "Maps", "Drive", "Photos", "Gmail", "Chrome", "Pixel",
  "Play Store", "Ads", "Cloud", "Meet", "Docs", "Sheets", "Slides", "Hangouts", "meets",
  "Calendar", "Translate", "News", "Analytics", "Duo", "Home", "Stadia", "Nest",
  "Fi", "One", "Classroom", "AdSense", "Photoscan", "Books", "Fonts", "Trends",
  "Scholar", "Groups", "Keep", "YouTube", "Android", "Chromecast", "Jamboard", "Google"
];

function cleanPrompt(text) {
    return text
        .replace(/[^\w\s.,!?-]/g, "")  // Hanya hapus karakter aneh, bukan semuanya
        .split(" ")
        .slice(0, 500)  // Boleh sampai 15 kata
        .join(" ");
}

const generateResponse = async (botMsgDiv) => {
    let textElement = botMsgDiv.querySelector(".message-text");
    if (!textElement) {
        console.error("❌ textElement tidak ditemukan!");
        return;
    }

    controller = new AbortController();

    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: (({ fileName, isImage, ...rest }) => rest)(userData.file) }] : [])]
    });

    try {
        // 🔹 Kirim permintaan ke Gemini API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ contents: chatHistory }),
            signal: controller.signal
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        let responseText = data.candidates[0].content.parts[0].text
            .replace(/^(\s*)\* /gm, "$1• ") // Bullet points
            .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") // Bold
            .replace(/\*(.+?)\*/g, "<i>$1</i>") // Italic
            .trim();
// Cek apakah ada produk Google yang disebut
let isGoogleProduct = googleProductsWithoutGoogle.some(product =>
    new RegExp(`\\bGoogle ${product}\\b`, "i").test(userData.message) ||
    new RegExp(`\\bGoogle ${product}\\b`, "i").test(responseText)
);

// Jika tidak menyebut produk Google, ganti "Google" dengan "AdhiKarya Innovations"
if (!isGoogleProduct && !responseText.includes("Gemini")) {
    responseText = responseText.replace(
        /\bGoogle\b(?! (Search|Assistant|Maps|Drive|Photos|Gmail|Chrome|Pixel|Play Store|Ads|Cloud|Meet|Docs|Sheets|Slides|Hangouts|meets|Calendar|Translate|News|Analytics|Duo|Home|Stadia|Nest|Fi|One|Classroom|AdSense|Photoscan|Books|Fonts|Trends|Scholar|Groups|Keep|YouTube|Android|Chromecast|Jamboard))/gi, 
        "AdhiKarya Innovations"
    );

    // Tambahan: Jika ada kalimat seperti "Saya dibuat oleh Google", ubah juga
    responseText = responseText.replace(
        /saya (dibuat|dikembangkan) oleh Google/gi, 
        "Saya dikembangkan oleh AdhiKarya Innovations"
    );

    responseText = responseText.replace(
        /Google AI/gi, 
        "AdhiKarya Innovations AI"
    );
}
        // 🔹 Deteksi apakah perlu membuat gambar
        const requiresImage = /\b(buatkan|gambar|ilustrasi|visualisasi|sketsa|lukisan)\b/i.test(responseText);
if (requiresImage && !lastResponseWasImage) {  
    lastResponseWasImage = true;  

    // Buat elemen teks dengan animasi mengkilap
    textElement.textContent = "Menghasilkan gambar...";  
    textElement.classList.add("shining-text"); // Tambahkan efek  

    let cleanTextPrompt = cleanPrompt(responseText);  
    console.log("🔹 Prompt setelah dibersihkan:", cleanTextPrompt);  

    const imageUrl = await queryHuggingFace(cleanTextPrompt);  

    if (imageUrl) {  
    let imgElement = document.createElement("img");  
    imgElement.src = imageUrl;  
    imgElement.classList.add("generated-image");  
    botMsgDiv.setAttribute("data-image-url", imageUrl);  

    textElement.replaceWith(imgElement); 
    imgElement.onload = () => {
        imgElement.style.opacity = "1";
    };

    lastResponseWasImage = false; // 🔹 Reset flag setelah gambar berhasil dibuat

    const stopBtn = document.querySelector("#stop-response-btn");
    if (stopBtn) {
        fileUploadWrapper.classList.remove("active", "img-attached", "file-attached"); // Hapus tombol stop
    }

    let botControls = botMsgDiv.querySelector(".bot-controls");
    botControls.appendChild(addFileBtn);  
} else {  
    textElement.textContent = "Gagal membuat gambar.";  
    textElement.classList.remove("shining-text");  
    lastResponseWasImage = false; // 🔹 Pastikan di-reset meskipun gagal  
    }
        
        } else {
            lastResponseWasImage = false; // Reset flag agar bisa merespons teks lagi
            typingEffect(responseText, textElement, botMsgDiv);
        }

        chatHistory.push({
            role: "model",
            parts: [{ text: responseText }]
        });

    } catch (error) {
        textElement.style.color = "#d62939";
        textElement.textContent = error.name === "AbortError" ? "Oops! Terjadi Kesalahan, Coba lagi" : error.message;
        botMsgDiv.classList.remove("loading");
        document.body.classList.remove("bot-responding");
    } finally {
        userData.file = {};
    }
};
    

// 🔹 Fungsi untuk request ke Hugging Face dengan retry jika model loading
async function queryHuggingFace(prompt, retries = 5) {
    const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
    const HF_API_KEY = "Bearer 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"; // Ganti dengan API Key yang benar

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔹 Mengirim permintaan ke Hugging Face (Percobaan ${attempt}):`, prompt);

            const response = await fetch(HF_API_URL, {
                method: "POST",
                headers: {
                    Authorization: HF_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt }) // Pastikan format input benar
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                if (errorResponse.error && errorResponse.error.includes("loading")) {
                    console.warn(`⏳ Model masih loading, menunggu 30 detik... (Percobaan ${attempt}/${retries})`);
                    await new Promise(resolve => setTimeout(resolve, 30000)); // Tunggu sebelum mencoba lagi
                    continue;
                }
                console.error("❌ Error dari API Hugging Face:", errorResponse);
                throw new Error(`Gagal menghasilkan gambar: ${errorResponse.error}`);
            }

            // Jika respons adalah gambar, ubah ke URL blob
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            console.log("✅ Gambar berhasil dibuat:", imageUrl);
            return imageUrl;

        } catch (error) {
            console.error(`❌ Gagal menghubungi API Hugging Face (Percobaan ${attempt}/${retries}):`, error);
            if (attempt === retries) return null; // Jika gagal 5x, return null
        }
    }
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;

  promptInput.value = "";
  userData.message = userMessage;
  document.body.classList.add("bot-responding", "chats-active");
  fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");

  const userMsgHTML = `
  ${
    userData.file.data
      ? userData.file.isImage
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="img-attachment"/>`
        : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${userData.file.fileName}</p>`
      : ""
  }
  <p class="message-text"></p>
`;
  const userMsgDiv = createMsgElement(userMsgHTML, "user-message");
  userMsgDiv.querySelector(".message-text").textContent = userMessage;
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();

  // Cek respons AI lokal
  const aiResponse = getAIResponse(userMessage);
  if (aiResponse) {
    setTimeout(() => {
      const botMsgHTML = `
        <div class="bot-message" style="display: flex; gap: 5px; margin-left: 0px;">
          <img src="neuxon.png" class="avatar">
          <div class="message-content">
            <p class="message-text">Tunggu Sebentar...</p>
            <div class="bot-controls">
              <button class="copy-btn" title="Copy"><span class="material-symbols-rounded">content_copy</span></button>
              <button class="like-btn" title="Like"><span class="material-symbols-rounded">thumb_up</span></button>
              <button class="dislike-btn" title="Dislike"><span class="material-symbols-rounded">thumb_down</span></button>
              <button class="regenerate-btn" title="Regenerate"><span class="material-symbols-rounded">refresh</span></button>
                            <button class="download-image-btn" title="Download"><span class="material-symbols-rounded">download</span></button>
            </div>
          </div>
        </div>
      `;
      const botMsgDiv = createMsgElement(botMsgHTML, "bot-message");
      chatsContainer.appendChild(botMsgDiv);
      scrollToBottom();
      const textElement = botMsgDiv.querySelector(".message-text");
      typingEffect(aiResponse, textElement, botMsgDiv);

      // Tambahkan event listener setelah elemen ditambahkan
      addBotResponseControls(botMsgDiv);
    }, 600);
  } else {
    // Jika tidak ada respons AI lokal, lanjutkan dengan permintaan API
    setTimeout(() => {
      const botMsgHTML = `
        <div class="bot-message" style="display: flex; gap: 5px; margin-left: 0px;">
          <img src="neuxon.png" class="avatar">
          <div class="message-content">
            <p class="message-text">Mencari...</p>
            <div class="bot-controls">
              <button class="copy-btn" title="Copy"><span class="material-symbols-rounded">content_copy</span></button>
              <button class="like-btn" title="Like"><span class="material-symbols-rounded">thumb_up</span></button>
              <button class="dislike-btn" title="Dislike"><span class="material-symbols-rounded">thumb_down</span></button>
              <button class="regenerate-btn" title="Regenerate"><span class="material-symbols-rounded">refresh</span></button>
                            <button class="download-image-btn" title="Download"><span class="material-symbols-rounded">download</span></button>
            </div>
          </div>
        </div>
      `;
      const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
      chatsContainer.appendChild(botMsgDiv);
      scrollToBottom();
      generateResponse(botMsgDiv);

      // Tambahkan event listener setelah elemen ditambahkan
      addBotResponseControls(botMsgDiv);
    }, 600);
  }
};
function downloadImage(imageUrl) {
    median.share.downloadImage({ url: imageUrl })
        .then(() => {
            // Tampilkan notifikasi setelah gambar berhasil diunduh
            showDownloadNotification();
        })
        .catch((error) => {
            console.error("Gagal mengunduh gambar:", error);
        });
}

function showDownloadNotification() {
    if (Notification.permission === "granted") {
        new Notification("Unduhan Selesai", {
            body: "Gambar telah berhasil diunduh.",
            icon: "path/to/icon.png" // Ganti dengan path ikon notifikasi Anda
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("Unduhan Selesai", {
                    body: "Gambar telah berhasil diunduh.",
                    icon: "path/to/icon.png"
                });
            }
        });
    }
}

const sendPushNotification = async (userId, message) => {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic os_v2_app_24kyb3oxqzhthdnqr3yv6zqdxmh3zt2opm5u5d4tvhnodbnk2qr7en4qsjzecjyx5w74tyj6rupkib5orf5jnz36aovgup5zsxlxhgy' // Ganti dengan REST API Key Anda
        },
        body: JSON.stringify({
            app_id: 'd71580ed-d786-4f33-8db0-8ef15f6603bb', // Ganti dengan App ID Anda
            include_external_user_ids: [userId],
            contents: { en: message }
        })
    });

    if (!response.ok) {
        console.error('Gagal mengirim notifikasi:', await response.json());
    }
};
// Fungsi untuk menambahkan event listeners pada kontrol bot
const addBotResponseControls = (botMsgDiv) => {
  const copyBtn = botMsgDiv.querySelector(".copy-btn");
  const likeBtn = botMsgDiv.querySelector(".like-btn");
  const dislikeBtn = botMsgDiv.querySelector(".dislike-btn");
  const regenerateBtn = botMsgDiv.querySelector(".regenerate-btn");
const downloadBtn = botMsgDiv.querySelector(".download-image-btn");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const imageUrl = botMsgDiv.getAttribute("data-image-url");
    if (imageUrl) {
      downloadImage(imageUrl);
    } else {
      alert("Tidak ada gambar untuk diunduh.");
    }
  });
}
  if (copyBtn) {
    copyBtn.addEventListener("click", () => copyResponse(botMsgDiv));
  }

  if (likeBtn) {
    likeBtn.addEventListener("click", () => likeResponse(botMsgDiv));
  }

  if (dislikeBtn) {
    dislikeBtn.addEventListener("click", () => dislikeResponse(botMsgDiv));
  }

  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", () => regenerateResponse(botMsgDiv));
  }
};

// Fungsi untuk menyalin teks respons ke clipboard
const copyResponse = (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  if (textElement) {
    navigator.clipboard.writeText(textElement.textContent)
      .then(() => alert("Teks berhasil disalin!"))
      .catch(err => alert("Gagal menyalin teks: " + err));
  }
};

// Fungsi untuk menangani tombol Like
const likeResponse = (botMsgDiv) => {
  botMsgDiv.querySelector(".like-btn").classList.toggle("liked");
  console.log("Pesan disukai!");
};

// Fungsi untuk menangani tombol Dislike
const dislikeResponse = (botMsgDiv) => {
  botMsgDiv.querySelector(".dislike-btn").classList.toggle("disliked");
  console.log("Pesan tidak disukai!");
};

// Fungsi untuk menangani tombol Regenerate (untuk menghasilkan ulang respons)
const regenerateResponse = (botMsgDiv) => {
  botMsgDiv.classList.add("loading");
  const textElement = botMsgDiv.querySelector(".message-text");
  textElement.textContent = "Merespon Ulang...";

  // Menghapus respons lama dari chatHistory
  chatHistory.pop();

  // Mengirim ulang permintaan ke AI
  generateResponse(botMsgDiv);
};

const getAIResponse = (userInput) => {
  const lowerCaseInput = userInput.toLowerCase();
  const responseKey = Object.keys(aiResponses).find(
    (key) => key.toLowerCase() === lowerCaseInput
  );
  return aiResponses[responseKey];
};
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  
  const isImage = file.type.startsWith("image/");
  const isText = file.type === "text/plain";
  const isPdf = file.type === "application/pdf";
  const isCsv = file.type === "text/csv";
  const isVideo = file.type.startsWith("video/");
  
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = (e) => {
    fileInput.value = "";
    const base64String = e.target.result.split(",")[1];
    
    // Menampilkan preview sesuai tipe file
    if (isImage) {
      fileUploadWrapper.querySelector(".file-preview").src = e.target.result;
    } else if (isText) {
      fileUploadWrapper.querySelector(".file-preview").textContent = e.target.result;
    } else if (isPdf || isCsv) {
      // Menampilkan pesan atau preview file PDF/CSV
      fileUploadWrapper.querySelector(".file-preview").textContent = `File ${file.name} berhasil diupload`;
    } else if (isVideo) {
      const videoElement = document.createElement("video");
      videoElement.src = e.target.result;
      videoElement.controls = true;
      fileUploadWrapper.querySelector(".file-preview").innerHTML = "";
      fileUploadWrapper.querySelector(".file-preview").appendChild(videoElement);
    }

    fileUploadWrapper.classList.add("active", isImage ? "img-attached" : "file-attached");
    
    userData.file = {
      fileName: file.name,
      data: base64String,
      mime_type: file.type,
      isImage
    };
  };
});

document.querySelector("#cancel-file-btn").addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");
});

 document.querySelectorAll(".suggestions-item").forEach(item => {
   item.addEventListener("click", (event) => {
     event.preventDefault(); // Mencegah efek biru jika elemen <a>
     promptInput.value = item.querySelector(".text").textContent;
     promptForm.dispatchEvent(new Event("submit"));
   });
});
document.addEventListener("click", ({ target }) => {
   const wrapper = document.querySelector(".prompt-wrapper");
   const shouldHide = target.classList.contains("prompt-input") || (wrapper.classList.contains("hide-controls") && (target.id === "add-file-btn" || target.id === "stop-response-btn"));
 wrapper.classList.toggle("hide-controls", shouldHide);
});
document.querySelector("#stop-response-btn").addEventListener("click", () => {
  userData.file = {};
  controller?.abort();
  clearInterval(typingInterval);
  chatsContainer.querySelector(".bot-message.loading").classList.remove("loading");
document.body.classList.remove("bot-responding");
});

document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = "";
  document.body.classList.remove("bot-responding", "chats-active");
});

themeToggle.addEventListener("click", () => {
  const isLightTheme = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLightTheme ? "light_mode" : "dark_mode")
  themeToggle.textContent = isLightTheme ? "dark_mode" : "light_mode";
});
 
const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggle.textContent = isLightTheme ? "dark_mode" : "light_mode";
promptForm.addEventListener("submit", handleFormSubmit);
promptForm.querySelector("#add-file-btn").addEventListener("click", () => fileInput.click());
