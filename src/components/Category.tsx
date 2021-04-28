import React from 'react';

interface Props {
    category: string;
    onSelect: (category: string) => void;
}

export const Category: React.FC<Props> = ({ category, onSelect }) => {
    return (
        <div onClick={() => onSelect(category)}>{category}</div>
    )
}