import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from "../constants";

let chat: Chat | null = null;

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
        description: 'Presents a summary of the current order to the user for confirmation before finalizing.',
        parameters: { type: Type.OBJECT, properties: {} }
    },
    {
        name: 'finalizeOrder',
        description: 'Confirms and finalizes the order after the user has approved the summary.',
        parameters: { type: Type.OBJECT, properties: {} }
    },
    {
        name: 'cancelOrderPlacement',
        description: 'Cancels the order placement process if the user decides not to proceed after seeing the summary.',
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
    if (!process.env.API_KEY) {
        throw new Error("Gemini API Key not found. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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