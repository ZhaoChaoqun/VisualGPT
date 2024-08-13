export const apiKey = '7d81f6e4806d4d5fbab47c339e0519d1'
export const endPoint = 'https://zcq1.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview'
export const dummyMessages = [
    {
        role: 'user',
        content: 'How are you?'
    },
    {
        role: 'assistant',
        content: "I'm fine, How my i help you today"
    },
    {
        role: 'user',
        content: 'create an image of a dog playing with a ball'
    },
    {
        role: 'assistant',
        content: 'https://media.istockphoto.com/id/1048897352/photo/beagle-dog-fun-in-garden-outdoors-run-and-jump-with-ball-towards-camera.jpg?s=612x612&w=0&k=20&c=nOUjcSmUA1_D8MHo8hYT7x8nw8RBzOGgOf_BHROlnf4='
    }
]