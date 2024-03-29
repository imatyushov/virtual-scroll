import React, {useCallback, useRef, useState} from 'react';
import {useFixedSizeList} from "./useFixedSizeList";
import {faker} from "@faker-js/faker";

//TODO 1:
// 1.только вертикальная виртуализация
// 2. фиксированный размер элементов
// 3. overscan
// 4. flag isScrolling
// 5. вынести логику в хук


const mockItems = Array.from({length: 10_000}, (_,index) => ({
    id: Math.random().toString(36).slice(2),
    text: faker.lorem.paragraph({
    min: 3, max: 6
})
}))
console.log(mockItems)

const itemHeight = 40;
const containerHeight = 600;

const FixedVirtualScroll = () => {
    const [listItems, setListItems] = useState(mockItems);
    const scrollElementRef = useRef<HTMLDivElement>(null);
    const {virtualItems, totalHeight, isScrolling} = useFixedSizeList({
        itemHeight: itemHeight,
        itemsCount: listItems.length,
        listHeight: containerHeight,
        getScrollElement: useCallback(() => scrollElementRef.current, []),
    })
    console.log(virtualItems)
    return (
        <div style={{padding: '0 12'}}>
            <h1>List</h1>
            <span>
                {isScrolling ? <div>IsScrolling</div> : <div>NotIsScrolling</div>}
            </span>
            <div style={{marginBottom: 12}}>
                <button onClick={() => setListItems((items) => items.slice().reverse())}>
                    reverse
                </button>
            </div>
            <div
                ref={scrollElementRef}
                style={{
                    height: containerHeight,
                    overflow: "auto",
                    border: '1px solid lightgrey',
                    position: 'relative'
                }}>
                <div style={{height: totalHeight}}>
                    {virtualItems.map((virtualItem) => {
                        const item = listItems[virtualItem.index]!
                        return (
                            <div
                                style={{
                                    height: itemHeight,
                                    transform: `translateY(${virtualItem.offsetTop}px)`,
                                    padding: '6px 12px',
                                    position: 'absolute',
                                    top: 0,
                                }}
                                key={item.id}
                            >
                                {item.id && item.text}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default FixedVirtualScroll;


