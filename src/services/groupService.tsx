import axios from "axios";
import toast from "react-hot-toast";

type SignMessageArgs = {
    /** Message to sign with wallet */
    message: string | Uint8Array;
};

export async function createGroup(address: `0x${string}` | undefined, groupData: FormData) {
    try {
        const response = await axios.post("http://localhost:3000/createGroup", groupData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            console.log("Failed to create group");
        }

        return response.data;
    } catch (error) {
        console.log(`Error creating group: ${error}`);
    }
}


export async function fetchGroupMessages(address: string, groupId: string) {
    try {
        const data = JSON.stringify({
            "address": "0xafC55278246Ba557F639fA3A297EAeDe772Cf49C"
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/${groupId}/messages`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios.request(config);

        return response.data;
    } catch (error) {
        console.log(`Error fetching group messages: ${error}`);
    }
}

export async function sendGroupMessage(address: string, groupId: string, messageContent: string) {
    try {
        const response = await axios.post("http://localhost:3000/sendMessage", {
            address,
            groupId,
            messageContent,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            console.log("Failed to send group message");
        }
    } catch (error) {
        console.log(`Error sending group message: ${error}`);
    }
}

export async function sendGroupMedia(groupId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', groupId);

    try {
        const response = await axios.post("http://localhost:3000/sendMedia", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.statusText !== "OK") {
            console.log("Failed to send media");
        }
    } catch (error) {
        console.log(`Error sending media: ${error}`);
    }
}

export async function registerWithClient(address: `0x${string}` | undefined, signMessageAsync: (args?: SignMessageArgs) => Promise<`0x${string}`>) {
    if (address) {
        console.log("Starting")
        const res = await axios.post('http://localhost:3000/setupClient', {
            address,
        });
        console.log("Starting")
        console.log(res);
        if (res.status == 200) {
            try {
                const signatureText = res.data.signatureText;
                if (!signatureText) {
                    console.log("Client already Registered");
                    return;
                }
                const signature = await signMessageAsync({ message: signatureText }) || "";
                // const signatureBytes = toBytes(signature);
                const res2 = await axios.post('http://localhost:3000/registerClient', {
                    address: address,
                    signature: signature,
                    signatureText: signatureText,
                });
                console.log(res2);
            } catch (error) {
                toast.error("Error with signing message. Please try again.");
            }
        }
    }
    else toast.error("Wallet not connected.");
};

export async function fetchGroupConversations(address: string) {
    if (!address) return;
    try {
        const response = await axios.post("http://localhost:3000/conversations", {
            address: address,
        });
        console.log(response);
        return response.data.conversations;
    } catch (error) {
        console.log(`Error fetching group conversations:`, error);
        toast.error("Error fetching chats. Please try refreshing.");
    }
} // clean

export async function fetchInboxId(address: string) {
    if (!address) return;
    try {
        const response = await axios.get(`http://localhost:3000/inboxId?address=${address}`);
        console.log(response);
        return response.data.inboxId;
    } catch (error) {
        console.log(`Error fetching inboxId:`, error);
        toast.error("Error fetching inboxId. Please try refreshing.");
    }
} // clean