const submitBtn = document.querySelector("#submit_btn")
const imageSection = document.querySelector(".image-section")
const captionSection = document.querySelector(".caption-section")

function getTopic() {
    console.log("getTopic")

    fetch('https://api.api-ninjas.com/v1/bucketlist', {
        method: 'GET',
        headers: {
            'X-Api-Key': config.NINJA_KEY,
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed with status: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            // Handle the API response here
            console.log(result.item)
            document.getElementById('prompt').textContent = result.item;
            getImage(result.item);
            getCaption(result.item);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle the error here
        });
}

const getCaption = async (topic) => {
    console.log("getCaption")

    let prompt_caption = "Create a long form Instagram post in the tone of a witty, sarcastic, intelligent, funny influencer who just completed the following activity.\n\nActivity: " + topic;

    document.querySelectorAll(".caption-container").forEach(el => el.remove());

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.OPEN_AI_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model":"text-davinci-003",
            "prompt":prompt_caption,
            "temperature":0.82,
            "max_tokens":3354,
            "top_p":1,
            "frequency_penalty":0,
            "presence_penalty":0,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/completions', options)
        const data = await response.json()
        console.log(data.choices[0].text)
        // document.getElementById('caption').textContent = data.choices[0].text;

        data?.choices.forEach(captionObject => {
            const CaptionContainer = document.createElement('div')
            CaptionContainer.classList.add('caption-container')
            const captionElement = document.createElement('p')
            captionElement.textContent = captionObject.text
            CaptionContainer.append(captionElement)
            captionSection.append(CaptionContainer)
        })

    } catch (error) {
        console.error(error)
    }
}

const getImage = async (topic) => {
    console.log("getImage");

    let prompt_img = "Teacher T. Rex " + topic + ", digital art, funny";

    document.querySelectorAll(".image-container").forEach(el => el.remove());

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.OPEN_AI_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": prompt_img,
            "n": 1,
            "size": "1024x1024"
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', options)
        const data = await response.json()
        console.log(data)

        data?.data.forEach(imageObject => {
            const ImageContainer = document.createElement('div')
            ImageContainer.classList.add('image-container')
            const imageElement = document.createElement('img')
            imageElement.setAttribute('src', imageObject.url)
            ImageContainer.append(imageElement)
            imageSection.append(ImageContainer)
        })
    } catch (error) {
        console.error(error)
    }
}

const topic = submitBtn.addEventListener('click', getTopic)
