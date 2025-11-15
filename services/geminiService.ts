
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const functionDeclarations: FunctionDeclaration[] = [
    {
        name: 'getMenu',
        description: 'Get the list of available menu items.',
        parameters: { type: Type.OBJECT, properties: {} }
    },
    {
        name: 'addToOrder',
        description: 'Add an item to the current order.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                itemName: { type: Type.STRING, description: 'The name of the menu item to add.' },
                quantity: { type: Type.INTEGER, description: 'The number of items to add.' }
            },
            required: ['itemName', 'quantity']
        }
    },
    {
        name: 'placeOrder',
        description: 'Finalize and place the current order.',
        parameters: { type: Type.OBJECT, properties: {} }
    },
    {
        name: 'getOrderStatus',
        description: 'Check the status of a previously placed order.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                orderId: { type: Type.STRING, description: 'The ID of the order to check.' }
            },
            required: ['orderId']
        }
    }
];

const initializeChat = () => {
    if (!ai) {
        throw new Error("Gemini AI not initialized. Make sure API_KEY is set.");
    }
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations }],
        },
    });
};


export const sendMessageToGemini = async (message: string, localFunctions: any): Promise<string> => {
    if (!chat) {
        initializeChat();
    }
    if (!chat) {
        return "Chat could not be initialized.";
    }

    let response = await chat.sendMessage({ message });

    while (response.functionCalls && response.functionCalls.length > 0) {
        const functionCalls = response.functionCalls;
        console.log('Gemini wants to call functions:', functionCalls);

        const functionCall = functionCalls[0];
        const { name, args } = functionCall;

        if (localFunctions[name]) {
            try {
                const result = await localFunctions[name](args);
                console.log(`Function ${name} executed with result:`, result);

                response = await chat.sendMessage({
                    message: `Function ${name} returned: ${JSON.stringify(result)}`
                });

            } catch (error) {
                console.error(`Error executing function ${name}:`, error);
                response = await chat.sendMessage({
                    message: `An error occurred while trying to execute ${name}.`
                });
            }
        } else {
            console.warn(`Function ${name} is not defined locally.`);
            response = await chat.sendMessage({
                message: `The requested function ${name} is not available.`
            });
        }
    }
    
    return response.text;
};
