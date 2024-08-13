import axios from 'axios';
const {apiKey, endPoint} = require('../constants/index')
const  client = axios.create({
    headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
    }

})
// payload="{\"messages\":[{\"role\":\"system\",\"content\":[{\"type\":\"text\",\"text\":\"You are an AI assistant that helps people find information.\"}]}],\"temperature\":0.7,\"top_p\":0.95,\"max_tokens\":800}"
//    curl "https://zcq1.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview" \
//   -H "Content-Type: application/json" \
//   -H "api-key: YOUR_API_KEY" \
//   -d "$payload"
const payload = {
    "temperature": 0.7,
    "top_p": 0.95,
    "max_tokens": 800
}
const system_message = [ { "role": "system", "content": [ { "type": "text", "text": "You are an AI assistant that helps people find information." } ] }]
export default apiCall = async (prompt, messages) => {
    try {
        messages = messages || system_message
        payload.messages = messages
        console.log('messages:', messages)
        const response = await client.post(endPoint, payload)
        message = response.data.choices[0].message
        messages.push(messages)
        console.log('response:', response.data.choices[0].message)
        return Promise.resolve({success: true, message})
    } catch (error) {
        console.log('error:', error)
        return Promise.resolve({success: false, message: error.message})
    }
}