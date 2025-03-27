import { useState, useEffect } from "react";
import ShoppingList from "../components/ShoppingList";
import "../style/ShopAndCook.css";
import Modal from "../components/Modal";
import axios from "axios";
import CryptoJS from "crypto-js";
import { p } from "framer-motion/client";

const ShopAndCook = () => {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentListId, setCurrentListId] = useState(0);

    const decryptToken = () => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = localStorage.getItem('authToken');
        const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    };

    const fetchShoppingLists = async () => {
        const token = decryptToken();
        try {
            const response = await axios.get("/grocery-lists", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("response: ", response);
            return response.data;
        } catch (error) {
            console.error("Error fetching grocery lists:", error.message);
            return [];
        }
    };

    useEffect(() => {
        const loadShoppingLists = async () => {
            const data = await fetchShoppingLists();
            setShoppingLists(data);
        };

        loadShoppingLists();
    }, []);

    const addShpList = async () => {
        const token = decryptToken();
        try {
            const response = await axios.post("/add-grocery-list",
                { title: "Add title" },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const loadShoppingLists = async () => {
                const data = await fetchShoppingLists();
                setShoppingLists(data);
            };

            loadShoppingLists();
            console.log(shoppingLists);
        } catch (error) {
            console.error("Error adding shopping list:", error);
        }
    };





    const handleDelete = (listId) => {
        setIsModalOpen(true);
        setCurrentListId(listId);

    }

    const handleConfirmDelete = async () => {
        const token = decryptToken();
        try {
            await axios.delete(`/delete-list/${currentListId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShoppingLists((prevLists) => prevLists.filter(list => list.id !== currentListId));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting shopping list:", error.message);
        }
    };

    return (
        <div className="shp-cook-container">
            <div className="btn-container">
                <button className="add-shp-list-btn" onClick={addShpList}>
                    Add new shopping list
                </button>
            </div>
            <div className="shp-lists-container">
                {shoppingLists && shoppingLists.length > 0 ? (
                    shoppingLists.map((list) => (
                        <div key={list.id} className="shopping-list-wrapper">
                            <ShoppingList listItems={list.items} id={list.id} listTitle={list.title} />
                            <button onClick={() => handleDelete(list.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No shopping list available</p>
                )}
            </div>
            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete ?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );


};

export default ShopAndCook;
