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

export async function fetchGroupConversations(address: string) {
    try {
        // let data = JSON.stringify({
        //     "address": "0xafC55278246Ba557F639fA3A297EAeDe772Cf49C"
        //   });
        const response = await axios.post("http://localhost:3000/conversations", {
            // headers: {
            //     "Content-Type": "application/json",
            // },
            data: { address: "0xafC55278246Ba557F639fA3A297EAeDe772Cf49C" },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        // console.log(`Error fetching group conversations: ${error.message}`);
    }
}

export async function fetchGroupMessages(address: `0x${string}` | undefined, groupId: string) {
    try {
        const response = await axios.get(`http://localhost:3000/groupMessages?groupId=${groupId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            data: { address },
        });

        return response.data;
    } catch (error) {
        console.log(`Error fetching group messages: ${error}`);
    }
}

export async function sendGroupMessage(address: `0x${string}` | undefined, groupId: string, content: string, contentType: string = "text") {
    try {
        const response = await axios.post("http://localhost:3000/sendMessage", {
            address,
            groupId,
            content,
            contentType,
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