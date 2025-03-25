import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import '../style/ShoppingList.css';
import { Trash, CircleX, Trash2 } from 'lucide-react';

const ShoppingList = () => {
    const [grocery, setGrocery] = useState('');
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [hoveredItems, setHoveredItems] = useState({});

    const handleMouseEnter = (index) => {
        setHoveredItems(prevState => ({ ...prevState, [index]: true }));
    };

    const handleMouseLeave = (index) => {
        setHoveredItems(prevState => ({ ...prevState, [index]: false }));
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            addGrocery();
        }
    };


    // Add a new grocery item
    const addGrocery = () => {
        if (grocery.trim() !== '') {
            setItems([...items, grocery]);
            setGrocery('');
            setCount(prevCount => prevCount + 1);
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

        const reorderedItems = reorder(items, result.source.index, result.destination.index);
        setItems(reorderedItems);
    };


    const onDeleteListItem = (index) => {
        const updatedList = [...items]; // Copy the list 
        updatedList.splice(index, 1); // Remove the item 
        setItems(updatedList);
    }

    return (
        <div className="shp-list-container">
            <div className="shp-list">
                <span className='shp-list-title'>
                    <h2
                        className="editable-title"
                        contentEditable
                        suppressContentEditableWarning
                    >
                        Add title
                    </h2>
                </span>
                <span className="list-item">
                    <input
                        type="text"
                        placeholder="Add an item you wish to buy!"
                        value={grocery}
                        onChange={(e) => setGrocery(e.target.value)}
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
                                                <span>{item}</span>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => onDeleteListItem(index)}
                                                    onMouseEnter={() => handleMouseEnter(index)}
                                                    onMouseLeave={() => handleMouseLeave(index)}
                                                >
                                                    {hoveredItems[index] ? <Trash2 /> : <Trash />}
                                                </button>
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
