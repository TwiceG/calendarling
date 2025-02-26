import React from 'react';

const Input = (props) => {
    return (
        <input
            type={props.type}
            placeholder={props.placeholder}
            value={props.item}
            title={props.title}
            minLength={props.minLength}
            pattern={props.pattern}
            onChange={(e) => props.setItem(e.target.value)}
            min={props.min}
            required
        />
    );
};

export default Input;
