import { useState } from "react";
import ShoppingList from "../components/ShoppingList";
import "../style/ShopAndCook.css";

const ShopAndCook = () => {
    const [shoppingLists, setShoppingLists] = useState([<ShoppingList key={0} />]);

    const addShpList = () => {
        setShoppingLists([...shoppingLists, <ShoppingList key={shoppingLists.length} />]);
    };

    return (
        <div className="shp-cook-container">
            <div className="btn-container">
                <button className="add-shp-list-btn" onClick={addShpList}>
                    Add new shopping list
                </button>
            </div>
            <div className="shp-lists-container">
                {shoppingLists}
            </div>
        </div>
    );
};

export default ShopAndCook;
