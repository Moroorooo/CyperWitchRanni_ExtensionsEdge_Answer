document.addEventListener('DOMContentLoaded', () => {
  const answerDiv = document.getElementById('answer');
  const copyBtn = document.getElementById('copyBtn');

  // API Key tích hợp trực tiếp .Dont leak pls...!
  const apiKey = "API_KEY"; // Thay bằng Groq API key của bạn

  // Lấy văn bản được bôi đen
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => window.getSelection().toString()
    }, (result) => {
      const selectedText = result[0].result;
      if (selectedText) {
        answerDiv.textContent = "Loading..."; // Thông báo tạm thời khi chờ API
        generateAnswer(selectedText, apiKey).then(answer => {
          answerDiv.textContent = answer; // Chỉ hiển thị câu trả lời
        }).catch(error => {
          answerDiv.textContent = `ERROR: ${error.message}`;
        });
      } else {
        answerDiv.textContent = "Vui_Long_Boi_Den_Cau_Hoi";
      }
    });
  });

  // Xử lý nút Copy
  copyBtn.addEventListener('click', () => {
    const textToCopy = answerDiv.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 2000); // Trở lại "Copy" sau 2 giây
    }).catch(err => {
      answerDiv.textContent = `Error copy: ${err}`;
    });
  });
});

// Hàm gọi Groq API
async function generateAnswer(question, apiKey) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `You are a Vietnamese student and answer in your personal opinion in a short and easy to understand way, please answer this question in 200 words and answer in Vietnamese: ${question}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 300 // Gần 300 từ
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "KHONG_CO_CAU_TRA_LOI";
}
