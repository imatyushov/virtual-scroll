//TODO 2:
// 1. размер контейнера +
// 2. разный размер элементов массива +
// 3. отслеживание элементов через resizeObserver +
// 4. корректировка скролла?

//TODO 3:
// 1. Динамический замер элементов +
// 2. Кеширование замеров +
// 3. хук useLatest (решение проблемы с Concurrent mode React 18) +
// 4. Проверяем, если элемент уже в кэше, то нет необходимости замера +
// 5. Перезамер элементов, если они изменили высоту +


import {useCallback, useInsertionEffect, useLayoutEffect, useRef, useState} from "react";
import {useDynamicSizeList} from "./useDynamicSizeList";
import {faker} from "@faker-js/faker";

const mockItems = Array.from({length: 10_000}, (_, index) => ({
    id: Math.random().toString(36).slice(2),
    text: faker.lorem.paragraph({
        min: 3, max: 6
    })
}))

// console.log('Mock items:', mockItems);

const containerHeight = 650;

const DynamicVirtualScroll = () => {
    const [listItems, setListItems] = useState(mockItems);
    const scrollElementRef = useRef<HTMLDivElement>(null);

    const {virtualItems, isScrolling, totalHeight, computeItem} = useDynamicSizeList({
        estimateItemHeight: useCallback(() => 30, []),
        getItemKey: useCallback((index) => listItems[index]!.id, [listItems]),
        itemsCount: listItems.length,
        getScrollElement: useCallback(() => scrollElementRef.current, [])
    });

    useLayoutEffect(() => {
        console.log('use layout effect')
    }, [])

    useInsertionEffect(() => {
        console.log('use insertion effect')
    }, [])

    const cbRef = useCallback(() => {
        console.log('callback ref')
    }, [])

    return (
        <div style={{padding: '0 12'}}>
            <h1>Virtual List</h1>
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
                    border: '2px solid green',
                    position: 'relative'
                }}>
                <div style={{height: totalHeight}}>
                    {virtualItems.map((virtualItem) => {
                        const item = listItems[virtualItem.index]!;
                        const virtualItemHeight = virtualItem.height;
                        return (
                            <div
                                ref={computeItem}
                                data-index={virtualItem.index}
                                key={item.id}
                                style={{
                                    transform: `translateY(${virtualItem.offsetTop}px)`,
                                    padding: '6px 12px',
                                    position: 'absolute',
                                    top: 0
                                }}
                            >
                                {virtualItem.index}_{item.text}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default DynamicVirtualScroll;