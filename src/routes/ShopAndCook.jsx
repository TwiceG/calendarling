import { useState } from "react";
import ShoppingList from "../components/ShoppingList";
import "../style/ShopAndCook.css";

const ShopAndCook = () => {
    const [shoppingLists, setShoppingLists] = useState([{ id: 0 }]);

    const addShpList = () => {
        setShoppingLists([...shoppingLists, { id: shoppingLists.length }]);
    };

    const deleteShoppingList = (id) => {
        setShoppingLists(shoppingLists.filter(list => list.id !== id));
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
                        <button onClick={() => deleteShoppingList(list.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopAndCook;
