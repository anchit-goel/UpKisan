async function uploadImage() {
    const input = document.getElementById('imageInput');
    if (input.files.length === 0) {
        alert('Please upload an image!');
        return;
    }

    const formData = new FormData();
    formData.append('image', input.files[0]);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error analyzing image');
        }

        const result = await response.json();
        
        if (result.error) {
            alert(result.error);
            return;
        }

        // Display soil data
        document.getElementById('soilData').textContent = JSON.stringify(result.soil_data, null, 2);

        // Display recommendations
        const recommendationsList = document.getElementById('recommendations');
        recommendationsList.innerHTML = '';

        result.recommendations.model_recommendations.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.crop}</strong> - Confidence: ${(item.confidence * 100).toFixed(2)}% <br>
                Soil Preference: ${item.soil_preference} <br>
                Organic Matter Benefits: ${item.organic_matter_benefits}
            `;
            recommendationsList.appendChild(li);
        });

        document.getElementById('results').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to analyze the image.');
    }
}
