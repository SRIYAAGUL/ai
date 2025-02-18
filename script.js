const generateForm = document.querySelector(".generate-form");//getting a class
const imageGallery = document.querySelector(".image-gallery");//getting a class
const OPENAI_API_KEY="";
const updateImageCard=(imgDataArray)=>{
    imgDataArray.forEach((imgObject, index)=>{
         const imgCard = imageGallery.querySelectorAll(".img-card")[index];
         const imgElement = imgCard.querySelector("img");
         const downloadBtn = imgCard.querySelector(".download-btn");
         const aiGeneratedImg = `data:image/jpeg;base64,${imgobject.b64_json}`;
         imgElement.src= aiGeneratedImg;
         //when the image is loaded, remove loading class and download attributes
         imgElement.onload = () => {
            imgCard.classList.remove("loadimg");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
         }
    });
}
const generateAiImages= async (userprompt, userImgQuantity) => {

    try{
         // send a request to open ai to generate images
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userprompt,
                n: parseInt(userImgQuantity),
                size:"512x512",
                response_format:"b64_json"

            })
        });

        if(!response.ok) throw new Error("failed to generate image, please try again");
        const{data}= await response.json();//get data from response
        updateImageCard([...  data]);
    }
    
    catch(error){
        alert(error.message);
    }
}

function handleFormSuubmission (e){
e.preventDefault();//prevent form from submitting

//get user input and image quantity from the form

const userprompt = e.srcElement[0].value;
const userImgQuantity = e.srcElement[1].value;

//create image cards based on selected number
// creating html markup for image cards with loading state

const imgCardMarkup = Array.from({length: userImgQuantity},() =>
 `   <div class="img-card loading">
<img src="loader.svg"><a href="#" class="download-btn"><img src="dow.png"></a>
</div> `
).join("");

imageGallery.innerHTML = imgCardMarkup;

//generate image using prompt
generateAiImages(userprompt,userImgQuantity);

}

generateForm.addEventListener("submit", handleFormSuubmission);//add event listener
