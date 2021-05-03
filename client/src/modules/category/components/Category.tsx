import React from 'react';
import { ITodo } from 'interfaces/todo';

interface Props {
    category: ITodo["category"];
    onSelect: (category: string) => void;
}

export const Category: React.FC<Props> = ({ category, onSelect }) => {
    return (
        <div onClick={() => onSelect(category)}>{category}</div>
    )
}