async function processImage() {
  const imageInput = document.getElementById("imageInput");
  const resultDiv = document.getElementById("result");
  const aiAnswerDiv = document.getElementById("aiAnswer");

  const file = imageInput.files[0];
  if (!file) {
    alert("Please upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;

    try {
      // OCR request
      const textRes = await fetch("/api/extract-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });

      const textData = await textRes.json();
      if (!textData.success) throw new Error(textData.error || "OCR failed");

      resultDiv.innerText = "Extracted Text:\n" + textData.text;

      // AI answer request
      const aiRes = await fetch("/api/get-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textData.text, imageUrl: base64Image }) // Include image
      });

      const aiData = await aiRes.json();
      if (!aiData.success) throw new Error(aiData.error || "AI failed");

      aiAnswerDiv.innerText = "AI Response:\n" + aiData.answer;
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred: " + err.message);
    }
  };

  reader.readAsDataURL(file);
}
