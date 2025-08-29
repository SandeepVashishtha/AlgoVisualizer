import React, { useState, useEffect, useRef } from 'react';
// import { bubbleSort } from '../algorithms/bubbleSort';
// import { selectionSort } from '../algorithms/selectionSort';
// import { mergeSort } from '../algorithms/mergeSort';
// import { insertionSort } from '../algorithms/insertionSort';
import '../styles/pages.css';

const Sorting = () => {
    const [array, setArray] = useState([]);
    const [colorArray, setColorArray] = useState([]);
    const [message, setMessage] = useState('Ready to sort!');
    const [delay, setDelay] = useState(100);
    const [algorithm, setAlgorithm] = useState('bubbleSort');
    const [isSorting, setIsSorting] = useState(false);
    const [arraySize, setArraySize] = useState(20);
    const [statistics, setStatistics] = useState({ comparisons: 0, swaps: 0, time: 0 });
    const [startTime, setStartTime] = useState(null);
    const stopSortingRef = useRef(false);

    useEffect(() => {
        const generateNewArray = () => {
            const randomArray = Array.from({ length: arraySize }, () => 
                Math.floor(Math.random() * 300) + 10
            );
            setArray(randomArray);
            setColorArray(new Array(arraySize).fill('#66ccff'));
            setMessage('New array generated. Ready to sort!');
            setIsSorting(false);
        };
        generateNewArray();
    }, [arraySize]);

    const generateArray = () => {
        const randomArray = Array.from({ length: arraySize }, () => 
            Math.floor(Math.random() * 300) + 10
        );
        setArray(randomArray);
        setColorArray(new Array(arraySize).fill('#66ccff'));
        setMessage('New array generated. Ready to sort!');
        setIsSorting(false);
    };

    const handleSort = async () => {
        setIsSorting(true);
        stopSortingRef.current = false;
        setStatistics({ comparisons: 0, swaps: 0, time: 0 });
        setStartTime(Date.now());
        setMessage(`Sorting with ${getAlgorithmName()} algorithm...`);
        
        let result = -1;
        try {
            switch (algorithm) {
                case 'selectionSort':
                    result = await selectionSortWithStop(array, setArray, setColorArray, delay, stopSortingRef, setStatistics);
                    break;
                case 'mergeSort':
                    result = await mergeSortWithStop(array, setArray, setColorArray, delay, stopSortingRef, setStatistics);
                    break;
                case 'insertionSort':
                    result = await insertionSortWithStop(array, setArray, setColorArray, delay, stopSortingRef, setStatistics);
                    break;
                default:
                    result = await bubbleSortWithStop(array, setArray, setColorArray, delay, stopSortingRef, setStatistics);
                    break;
            }

            const endTime = Date.now();
            const timeTaken = endTime - startTime;
            setStatistics(prev => ({ ...prev, time: timeTaken }));

            if (stopSortingRef.current) {
                setMessage('❌ Sorting was stopped');
                setColorArray(new Array(arraySize).fill('#66ccff'));
            } else if (result === -1) {
                setMessage('Sorting failed or was interrupted');
            } else {
                setMessage(`🎉 Sorting completed in ${timeTaken}ms!`);
                // Highlight all bars as sorted
                setColorArray(new Array(arraySize).fill('#4ade80'));
            }
        } catch (error) {
            setMessage('❌ Sorting was stopped');
            setColorArray(new Array(arraySize).fill('#66ccff'));
        }
        setIsSorting(false);
    };

    const handleStop = () => {
        stopSortingRef.current = true;
        setIsSorting(false);
        setMessage('🛑 Stopping sorting...');
        setColorArray(new Array(arraySize).fill('#66ccff'));
    };

    const getAlgorithmName = () => {
        const names = {
            'bubbleSort': 'Bubble Sort',
            'selectionSort': 'Selection Sort',
            'mergeSort': 'Merge Sort',
            'insertionSort': 'Insertion Sort'
        };
        return names[algorithm];
    };

    const getAlgorithmInfo = () => {
        const info = {
            'bubbleSort': {
                description: 'Compares adjacent elements and swaps them if they are in wrong order.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                bestCase: 'O(n)',
                stable: 'Yes'
            },
            'selectionSort': {
                description: 'Finds the minimum element and places it at the beginning.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                bestCase: 'O(n²)',
                stable: 'No'
            },
            'mergeSort': {
                description: 'Divides array into halves, sorts them and merges back.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                bestCase: 'O(n log n)',
                stable: 'Yes'
            },
            'insertionSort': {
                description: 'Builds sorted array one element at a time.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                bestCase: 'O(n)',
                stable: 'Yes'
            }
        };
        return info[algorithm];
    };

    // Helper function to create delay and check for stop
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Bubble Sort with Stop Functionality
    const bubbleSortWithStop = async (arr, setArray, setColorArray, delay, stopRef, setStats) => {
        const newArray = [...arr];
        const n = newArray.length;
        let comparisons = 0, swaps = 0;

        for (let i = 0; i < n - 1; i++) {
            if (stopRef.current) throw new Error('Stopped');
            
            for (let j = 0; j < n - i - 1; j++) {
                if (stopRef.current) throw new Error('Stopped');
                
                comparisons++;
                
                // Highlight comparing elements
                const colors = new Array(n).fill('#66ccff');
                colors[j] = '#ff6b6b';
                colors[j + 1] = '#ff6b6b';
                setColorArray([...colors]);
                
                await sleep(delay);
                
                if (newArray[j] > newArray[j + 1]) {
                    // Swap elements
                    [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
                    swaps++;
                    setArray([...newArray]);
                    
                    // Highlight swapped elements
                    colors[j] = '#ffd93d';
                    colors[j + 1] = '#ffd93d';
                    setColorArray([...colors]);
                    
                    await sleep(delay);
                }
                
                // Update statistics
                setStats({ comparisons, swaps, time: 0 });
            }
            
            // Mark as sorted
            const colors = new Array(n).fill('#66ccff');
            for (let k = n - i - 1; k < n; k++) {
                colors[k] = '#4ade80';
            }
            setColorArray([...colors]);
        }

        // Mark first element as sorted
        setColorArray(new Array(n).fill('#4ade80'));
        return 0;
    };

    // Selection Sort with Stop Functionality
    const selectionSortWithStop = async (arr, setArray, setColorArray, delay, stopRef, setStats) => {
        const newArray = [...arr];
        const n = newArray.length;
        let comparisons = 0, swaps = 0;

        for (let i = 0; i < n - 1; i++) {
            if (stopRef.current) throw new Error('Stopped');
            
            let minIdx = i;
            
            // Mark current minimum
            const colors = new Array(n).fill('#66ccff');
            colors[i] = '#ffd93d';
            setColorArray([...colors]);
            
            for (let j = i + 1; j < n; j++) {
                if (stopRef.current) throw new Error('Stopped');
                
                comparisons++;
                
                // Highlight comparing element
                colors[j] = '#ff6b6b';
                setColorArray([...colors]);
                
                await sleep(delay);
                
                if (newArray[j] < newArray[minIdx]) {
                    if (minIdx !== i) colors[minIdx] = '#66ccff';
                    minIdx = j;
                    colors[minIdx] = '#4da6ff';
                } else {
                    colors[j] = '#66ccff';
                }
                setColorArray([...colors]);
                setStats({ comparisons, swaps, time: 0 });
            }
            
            // Swap if needed
            if (minIdx !== i) {
                [newArray[i], newArray[minIdx]] = [newArray[minIdx], newArray[i]];
                swaps++;
                setArray([...newArray]);
                await sleep(delay);
            }
            
            // Mark as sorted
            for (let k = 0; k <= i; k++) {
                colors[k] = '#4ade80';
            }
            setColorArray([...colors]);
            setStats({ comparisons, swaps, time: 0 });
        }

        setColorArray(new Array(n).fill('#4ade80'));
        return 0;
    };

    // Insertion Sort with Stop Functionality
    const insertionSortWithStop = async (arr, setArray, setColorArray, delay, stopRef, setStats) => {
        const newArray = [...arr];
        const n = newArray.length;
        let comparisons = 0, swaps = 0;

        for (let i = 1; i < n; i++) {
            if (stopRef.current) throw new Error('Stopped');
            
            const key = newArray[i];
            let j = i - 1;
            
            // Highlight current element
            const colors = new Array(n).fill('#66ccff');
            colors[i] = '#ffd93d';
            setColorArray([...colors]);
            await sleep(delay);

            while (j >= 0 && newArray[j] > key) {
                if (stopRef.current) throw new Error('Stopped');
                
                comparisons++;
                colors[j] = '#ff6b6b';
                colors[j + 1] = '#ff6b6b';
                setColorArray([...colors]);
                
                newArray[j + 1] = newArray[j];
                swaps++;
                setArray([...newArray]);
                await sleep(delay);
                setStats({ comparisons, swaps, time: 0 });
                
                j--;
            }
            
            newArray[j + 1] = key;
            setArray([...newArray]);
            
            // Mark sorted portion
            for (let k = 0; k <= i; k++) {
                colors[k] = '#4ade80';
            }
            setColorArray([...colors]);
            await sleep(delay);
        }

        setColorArray(new Array(n).fill('#4ade80'));
        return 0;
    };

    // Merge Sort with Stop Functionality
    const mergeSortWithStop = async (arr, setArray, setColorArray, delay, stopRef, setStats) => {
        const newArray = [...arr];
        let comparisons = 0, swaps = 0;
        
        const merge = async (left, mid, right) => {
            if (stopRef.current) throw new Error('Stopped');
            
            const leftArr = newArray.slice(left, mid + 1);
            const rightArr = newArray.slice(mid + 1, right + 1);
            
            let i = 0, j = 0, k = left;
            
            while (i < leftArr.length && j < rightArr.length) {
                if (stopRef.current) throw new Error('Stopped');
                
                comparisons++;
                const colors = new Array(newArray.length).fill('#66ccff');
                colors[k] = '#ffd93d';
                setColorArray([...colors]);
                
                if (leftArr[i] <= rightArr[j]) {
                    newArray[k] = leftArr[i];
                    i++;
                } else {
                    newArray[k] = rightArr[j];
                    j++;
                }
                
                swaps++;
                setArray([...newArray]);
                setStats({ comparisons, swaps, time: 0 });
                await sleep(delay);
                k++;
            }
            
            while (i < leftArr.length) {
                if (stopRef.current) throw new Error('Stopped');
                newArray[k] = leftArr[i];
                swaps++;
                setArray([...newArray]);
                await sleep(delay);
                i++;
                k++;
            }
            
            while (j < rightArr.length) {
                if (stopRef.current) throw new Error('Stopped');
                newArray[k] = rightArr[j];
                swaps++;
                setArray([...newArray]);
                await sleep(delay);
                j++;
                k++;
            }
        };
        
        const mergeSortHelper = async (left, right) => {
            if (left < right) {
                if (stopRef.current) throw new Error('Stopped');
                
                const mid = Math.floor((left + right) / 2);
                await mergeSortHelper(left, mid);
                await mergeSortHelper(mid + 1, right);
                await merge(left, mid, right);
            }
        };
        
        await mergeSortHelper(0, newArray.length - 1);
        setColorArray(new Array(newArray.length).fill('#4ade80'));
        return 0;
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Sorting Algorithms Visualizer</h1>
            
            {/* Controls Section */}
            <div className="controls-section">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <button className="btn" onClick={handleSort} disabled={isSorting}>
                        {isSorting ? '⏳ Sorting...' : '▶️ Start Sort'}
                    </button>
                    <button className="btn btn-secondary" onClick={generateArray} disabled={isSorting}>
                        🔄 Generate Array
                    </button>
                    <button className="btn btn-secondary" onClick={handleStop} disabled={!isSorting}>
                        ⏹️ Stop
                    </button>
                </div>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '20px',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label className="label">Array Size:</label>
                        <input 
                            type="range" 
                            min="10" 
                            max="50" 
                            value={arraySize}
                            onChange={(e) => setArraySize(parseInt(e.target.value))}
                            disabled={isSorting}
                            className="input"
                            style={{ width: '120px' }}
                        />
                        <span style={{ 
                            color: '#66ccff', 
                            fontWeight: '600',
                            minWidth: '30px',
                            textAlign: 'center'
                        }}>
                            {arraySize}
                        </span>
                        <span style={{ 
                            fontSize: '11px', 
                            color: '#b8c5d1',
                            marginLeft: '5px'
                        }}>
                            {arraySize <= 15 ? '(with indices)' : arraySize <= 25 ? '(with values)' : '(bars only)'}
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label className="label">Speed:</label>
                        <input 
                            type="range" 
                            min="10" 
                            max="500" 
                            value={delay}
                            onChange={(e) => setDelay(parseInt(e.target.value))}
                            disabled={isSorting}
                            className="input"
                            style={{ width: '120px' }}
                        />
                        <span style={{ 
                            color: '#66ccff', 
                            fontWeight: '600',
                            minWidth: '50px',
                            textAlign: 'center'
                        }}>
                            {delay}ms
                        </span>
                        <span style={{ 
                            fontSize: '11px', 
                            color: '#b8c5d1',
                            marginLeft: '5px'
                        }}>
                            {delay < 50 ? '(very fast)' : delay < 150 ? '(fast)' : delay < 300 ? '(normal)' : '(slow)'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Algorithm Selection */}
            <div className="controls-section">
                <h3 style={{ color: '#66ccff', marginBottom: '15px', fontFamily: 'Poppins, sans-serif' }}>
                    Select Algorithm:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                    {['bubbleSort', 'selectionSort', 'mergeSort', 'insertionSort'].map((algo) => {
                        const algorithmNames = {
                            'bubbleSort': 'Bubble Sort',
                            'selectionSort': 'Selection Sort',
                            'mergeSort': 'Merge Sort',
                            'insertionSort': 'Insertion Sort'
                        };
                        
                        return (
                            <button
                                key={algo}
                                className={algorithm === algo ? 'btn' : 'btn btn-secondary'}
                                onClick={() => setAlgorithm(algo)}
                                disabled={isSorting}
                                style={{
                                    background: algorithm === algo ? 
                                        'linear-gradient(45deg, #66ccff, #4da6ff)' : 
                                        'rgba(255, 255, 255, 0.1)',
                                    color: algorithm === algo ? '#1a1a2e' : '#e0e6ed'
                                }}
                            >
                                {algorithmNames[algo]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Status Message */}
            <div className="status-message" style={{ 
                padding: '15px', 
                background: 'rgba(102, 204, 255, 0.1)', 
                borderRadius: '10px',
                border: '1px solid rgba(102, 204, 255, 0.3)',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#66ccff',
                margin: '20px 0'
            }}>
                {message}
                {isSorting && (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(102, 204, 255, 0.2)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #66ccff, #4da6ff)',
                                animation: 'progress 2s ease-in-out infinite',
                                borderRadius: '2px'
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Visualization Area */}
            <div className="visualization-area" style={{ 
                minHeight: '500px', 
                padding: '20px',
                background: 'rgba(15, 52, 96, 0.1)',
                borderRadius: '15px',
                border: '1px solid rgba(102, 204, 255, 0.2)',
                margin: '20px 0'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'flex-end', 
                    height: '400px',
                    gap: arraySize > 40 ? '1px' : arraySize > 25 ? '2px' : '3px',
                    overflowX: 'auto',
                    padding: '20px 10px 50px 10px',
                    position: 'relative'
                }}>
                    {array.map((num, idx) => {
                        const barWidth = Math.max(12, Math.min(40, 350 / arraySize));
                        const showNumbers = arraySize <= 25;
                        const showIndices = arraySize <= 15;
                        
                        return (
                            <div
                                key={idx}
                                style={{
                                    height: `${Math.max(20, num)}px`,
                                    width: `${barWidth}px`,
                                    backgroundColor: colorArray[idx],
                                    border: `1px solid ${colorArray[idx]}`,
                                    borderRadius: '6px 6px 0 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontWeight: 'bold',
                                    fontSize: arraySize > 40 ? '8px' : arraySize > 30 ? '9px' : arraySize > 20 ? '10px' : '11px',
                                    padding: '4px 2px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: `0 4px 12px ${colorArray[idx]}30`,
                                    position: 'relative',
                                    transform: isSorting ? 'scale(1.05)' : 'scale(1)',
                                    cursor: 'default'
                                }}
                                title={`Value: ${num}, Index: ${idx}`}
                            >
                                {/* Value display at top of bar */}
                                {showNumbers && (
                                    <div style={{
                                        color: '#ffffff',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                        fontWeight: 'bold',
                                        fontSize: 'inherit',
                                        minHeight: '14px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {num}
                                    </div>
                                )}
                                
                                {/* Index display at bottom outside the bar */}
                                {showIndices && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-35px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '10px',
                                        color: '#66ccff',
                                        background: 'rgba(26, 26, 46, 0.9)',
                                        padding: '3px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(102, 204, 255, 0.4)',
                                        minWidth: '20px',
                                        textAlign: 'center',
                                        fontWeight: '600'
                                    }}>
                                        {idx}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Array info display */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#66ccff',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: 'rgba(26, 26, 46, 0.8)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(102, 204, 255, 0.3)'
                    }}>
                        Array Size: {arraySize} | Speed: {delay}ms
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="controls-section">
                <h3 style={{ color: '#66ccff', marginBottom: '15px', fontFamily: 'Poppins, sans-serif' }}>
                    Performance Statistics
                </h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '15px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        background: 'rgba(102, 204, 255, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid rgba(102, 204, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#66ccff', fontSize: '14px', marginBottom: '5px' }}>Comparisons</div>
                        <div style={{ color: '#e0e6ed', fontSize: '20px', fontWeight: 'bold' }}>
                            {statistics.comparisons}
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 215, 61, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 215, 61, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#ffd93d', fontSize: '14px', marginBottom: '5px' }}>Swaps</div>
                        <div style={{ color: '#e0e6ed', fontSize: '20px', fontWeight: 'bold' }}>
                            {statistics.swaps}
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(74, 222, 128, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#4ade80', fontSize: '14px', marginBottom: '5px' }}>Time</div>
                        <div style={{ color: '#e0e6ed', fontSize: '20px', fontWeight: 'bold' }}>
                            {statistics.time}ms
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '5px' }}>Array Size</div>
                        <div style={{ color: '#e0e6ed', fontSize: '20px', fontWeight: 'bold' }}>
                            {arraySize}
                        </div>
                    </div>
                </div>
            </div>

            {/* Algorithm Information */}
            <div className="algorithm-info">
                <h3>{getAlgorithmName()} - Algorithm Details</h3>
                <p>{getAlgorithmInfo().description}</p>
                
                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                        <h4 style={{ color: '#66ccff', marginBottom: '8px' }}>Time Complexity:</h4>
                        <span className="complexity-badge">{getAlgorithmInfo().timeComplexity}</span>
                    </div>
                    <div>
                        <h4 style={{ color: '#66ccff', marginBottom: '8px' }}>Space Complexity:</h4>
                        <span className="complexity-badge">{getAlgorithmInfo().spaceComplexity}</span>
                    </div>
                    <div>
                        <h4 style={{ color: '#66ccff', marginBottom: '8px' }}>Best Case:</h4>
                        <span className="complexity-badge">{getAlgorithmInfo().bestCase}</span>
                    </div>
                    <div>
                        <h4 style={{ color: '#66ccff', marginBottom: '8px' }}>Stable:</h4>
                        <span className="complexity-badge">{getAlgorithmInfo().stable}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sorting;