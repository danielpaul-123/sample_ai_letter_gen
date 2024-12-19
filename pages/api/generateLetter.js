import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // console.log(req.body.prompt);
  const user_info = {
	  name : "memer_one"
  };
  const from_whome = "this letter is from" + user_info.name + "Use this name for your name as well as SCET as the address"; 
  const to_whome = "address this letter to The Principal Of Sahrdaya Collage Of Engineering Technology The localtion is Kodakara";
  const message = req.body.prompt + "write a letter regarding this topic Make it formal fill in the details only given" + to_whome + from_whome;
	
  // console.log(message);
  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    // Call the GROQ API to generate a chat completion
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192", // Specify the model as needed
    });

    // Extract the generated response
    const response =
      chatCompletion.choices[0]?.message?.content.trim() ||
      "No response generated.";

    res.status(200).json({ letter: response });
  } catch (error) {
    console.error("Error generating chat completion:", error.message);
    res.status(500).json({ error: error.message });
  }
}

