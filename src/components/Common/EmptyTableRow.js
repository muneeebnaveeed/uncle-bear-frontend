import React, { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

const Columns = ({ count }) => {
    const columns = useMemo(() => {
        const c = [];
        for (let i = 0; i < count - 1; i++) {
            c.push(<td key={`empty-column-${count}-${uuidV4()}`} />);
        }
        return c;
    }, [count]);

    return columns;
};

const EmptyTableRow = ({ children, columnCount }) => (
    <tr>
        <td>{children}</td>
        <Columns count={columnCount} />
    </tr>
);

export default EmptyTableRow;
