import { useState } from "react";
import ShoppingList from "../components/ShoppingList";
import "../style/ShopAndCook.css";
import Modal from "../components/Modal";

const ShopAndCook = () => {
    const [shoppingLists, setShoppingLists] = useState([{ id: 0 }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentListId, setCurrentListId] = useState(0);

    const addShpList = () => {
        setShoppingLists([...shoppingLists, { id: shoppingLists.length }]);
    };

    const handleDelete = (listId) => {
        setIsModalOpen(true);
        setCurrentListId(listId);

    }

    const handleConfirmDelete = (id) => {
        setShoppingLists(shoppingLists.filter(list => list.id !== id));
        setIsModalOpen(false);
    };

    return (
        <div className="shp-cook-container">
            <div className="btn-container">
                <button className="add-shp-list-btn" onClick={addShpList}>
                    Add new shopping list
                </button>
            </div>
            <div className="shp-lists-container">
                {shoppingLists.map((list) => (
                    <div key={list.id} className="shopping-list-wrapper">
                        <ShoppingList />
                        <button onClick={() => handleDelete(list.id)}>Delete</button>
                    </div>

                ))}
            </div>
            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete ?`}
                onConfirm={() => handleConfirmDelete(currentListId)}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ShopAndCook;
