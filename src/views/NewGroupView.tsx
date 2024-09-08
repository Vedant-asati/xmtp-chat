import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

interface FormData {
    groupName: string;
    description: string;
    imageUrl: string;
    members: string; // comma-separated addresses
}

const NewGroupView = () => {
    const [formData, setFormData] = useState<FormData>({
        groupName: "",
        description: "",
        imageUrl: "",
        members: "", // comma-separated addresses
    });

    const [groupId, setGroupId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [groupCreated, setGroupCreated] = useState<boolean>(false);
    const { address } = useAccount();

    // Handle input changes for all fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle group creation
    const handleCreateGroup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/createGroup", {
                address,
                ...formData,
            });
            setGroupCreated(true);
            setGroupId(response.data.groupId);
            toast.error("Group created successfully!");
            console.log("Group created successfully!");
        } catch (error) {
            toast.error(`Error creating group`);
            console.log(`Error creating group: `, error);
        } finally {
            setLoading(false);
        }
    };

    // Handle group update
    const handleUpdateGroup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!groupId) {
            toast.error("No group ID found. Please create the group first.");
            console.log("No group ID found. Please create the group first.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("/updateGroup", {
                address,
                groupId,
                ...formData, // Update the group with the current form data
            });
            toast.error("Group updated successfully!");
            console.log("Group updated successfully!");
        } catch (error) {
            toast.error(`Error updating group`);
            console.log(`Error updating group: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-group-container">
            <h2>{groupId ? "Update Group" : "Create a New Group"}</h2>
            <form
                onSubmit={groupId ? handleUpdateGroup : handleCreateGroup}
                className="group-form"
            >
                <label>
                    Group Name:
                    <input
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Members (comma-separated addresses):
                    <input
                        type="text"
                        name="members"
                        value={formData.members}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading
                        ? groupId
                            ? "Updating..."
                            : "Creating..."
                        : groupId
                            ? "Update Group"
                            : "Create Group"}
                </button>
            </form>
        </div>
    );
};

export default NewGroupView;
