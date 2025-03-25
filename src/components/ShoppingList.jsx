import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import '../style/ShoppingList.css';

const ShoppingList = () => {
    const [grocery, setGrocery] = useState('');
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);

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

    return (
        <div className="shp-list-container">
            <div className="shp-list">
                <span className="list-item">
                    <input
                        type="text"
                        placeholder="Add an item you wish to buy!"
                        value={grocery}
                        onChange={(e) => setGrocery(e.target.value)}
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
                                                {item}
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
