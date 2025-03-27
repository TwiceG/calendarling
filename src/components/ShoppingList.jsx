import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import '../style/ShoppingList.css';
import { Trash, CircleX, Trash2, SaveIcon } from 'lucide-react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const ShoppingList = ({ listItems, id, listTitle }) => {
    const [newItemName, setNewItemName] = useState('');
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [hoveredItems, setHoveredItems] = useState({});
    const [title, setTitle] = useState("Add title");
    const [isEditing, setIsEditing] = useState(false);
    const [listId, setListId] = useState();

    const decryptToken = () => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = localStorage.getItem('authToken');
        const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    };


    // Initialize state when listItems prop is received
    useEffect(() => {
        setTitle(listTitle);
        setListId(id);
        setItems(listItems);
        setCount(listItems.length);

    }, [listItems]);




    // Add hover effect only to the hovered item
    const handleMouseEnter = (index) => {
        setHoveredItems(prevState => ({ ...prevState, [index]: true }));
    };

    const handleMouseLeave = (index) => {
        setHoveredItems(prevState => ({ ...prevState, [index]: false }));
    };


    // Handle 'Enter' keydown on input field
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            addGrocery();
        }
    };

    const handleCheck = (index) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.position === index ? { ...item, is_checked: !item.is_checked } : item
            )
        );
    };


    // Add a new grocery item
    const addGrocery = () => {
        if (newItemName.trim() !== '') {
            const newItem = {
                grocery_list_id: listId,
                item_name: newItemName,
                is_checked: false,
                position: items.length,
            };

            setItems(prevItems => [...prevItems, newItem]);
            setNewItemName('');
            setCount(prevCount => prevCount + 1);
            console.log(items);
        }
    };


    // Reorder helper function
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    // Handle drag and drop
    const handleDragEnd = (result) => {
        if (!result.destination) return; // If dropped outside, do nothing

        // Reorder the items based on the drag result
        const reorderedItems = reorder(items, result.source.index, result.destination.index);

        // Update the position for each item in the reordered list
        const updatedItems = reorderedItems.map((item, index) => ({
            ...item,
            position: index,
        }));

        setItems(updatedItems);
    };


    const onDeleteListItem = async (index, itemId) => {
        const token = decryptToken();
        try {
            await axios.delete(`/delete-item/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Only update state if the API call succeeds
            const updatedList = [...items];
            updatedList.splice(index, 1); // Remove the item 

            // Update the positions of remaining items
            const updatedItems = updatedList.map((item, i) => ({
                ...item,
                position: i, // Reassign position based on new index
            }));

            setItems(updatedItems);
            setCount(prevCount => prevCount - 1);

            console.log("Updated Items after delete:", updatedItems);
        } catch (error) {
            console.error("Error deleting item:", error.message);
        }
    };

    const saveItems = async (token) => {
        try {
            const response = await axios.post("/save-items",
                {
                    list_id: listId,
                    items: items
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            return response.data;
        } catch (error) {
            console.error("Error saving grocery list:", error.message);
        }
    }

    const saveTitle = async (token) => {
        try {
            const response = await axios.post("/add-grocery-list",
                {
                    title: title,
                    listId: listId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            console.error("Error saving title:", error);
        }
    }

    const saveShoppingList = async () => {
        const token = decryptToken();
        saveItems(token);
        saveTitle(token);
    }


    return (
        <div className="shp-list-container">
            <div className="shp-list">
                <div className="shp-list-title">
                    {isEditing ? (
                        <input
                            type="text"
                            className="editable-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="editable-title"
                            onClick={() => setIsEditing(true)}
                        >
                            {title || "Add title"}
                        </h2>
                    )}
                    <span>{count} grocery item(s) to buy on your list</span>
                    <button className='save-btn' onClick={saveShoppingList}>Save</button>
                </div>
                <span className="list-item">
                    <input
                        type="text"
                        placeholder="Add an item you wish to buy!"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="button" onClick={addGrocery}>Add</button>
                </span>

                {/* Drag & Drop List */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={`drobable-${count}`}>
                        {(provided, snapshot) => (
                            <div
                                className={`grocery-items ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {items.map((item, index) => (
                                    <Draggable key={index} draggableId={index.toString()} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                className={`list-item draggable ${snapshot.isDragging ? 'dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <span className={item.is_checked ? "crossed-out" : ""}>{item.item_name}</span>

                                                <div className='utils-container'>
                                                    {/* Right-aligned utilities container */}
                                                    <button className="delete-btn"
                                                        onClick={() => onDeleteListItem(index, item.id)}
                                                        onMouseEnter={() => handleMouseEnter(index)}
                                                        onMouseLeave={() => handleMouseLeave(index)} >
                                                        {hoveredItems[index] ? <Trash2 /> : <Trash />}
                                                    </button>
                                                    <input className="bought-check" type="checkbox" onChange={() => handleCheck(index)} checked={item.is_checked || false} />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

export default ShoppingList;
