import React, {useEffect, useRef, useState} from "react";
import {initCanvasScene, showDataPrices} from "./Objects";
import {fetchData} from "./Query";

export const CustomLoader = () => {
    return <div>
        <div className="lds-ring">
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    </div>
}

const Gallery = () => {
    const canvasRef = useRef(null);

    const [escapeKey, setEscapeKey] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [block, setBlock] = useState(true)
    const [fetchFinished, setFetchFinished] = useState<boolean>(false)

    const [loading, setLoading] = useState<any>(0)
    let engine: any = null
    let scene: any = null

    useEffect(() => {
        initCanvasScene(engine, scene, canvasRef, setEscapeKey)
    }, []);

    useEffect(() => {
        showDataPrices(scene, data)
    }, [data]);

    const handlerStart = (e: any) => {
        e.preventDefault();
        setLoading(true)

        fetchData(setFetchFinished, setData).then(() => {
            setBlock(false)
        }).then(() => setLoading(false))
    }

    return (
        <div style={{height: '100vh', overflow: 'hidden'}}>
            {(escapeKey || block) &&
                <div className={'canvas-container'}>
                    <div className="center-div">
                        <div className="children-center-div">
                            {!fetchFinished && !loading && <>
                                <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <button disabled={loading}
                                            style={{marginLeft: '5px'}}
                                            className={"button"}
                                            onClick={(e: any) => {
                                                handlerStart(e)
                                            }}
                                    >
                                        Start
                                    </button>
                                </div>

                            </>
                            }
                            {
                                loading ?
                                <>
                                    <CustomLoader/>
                                </> : ""
                            }

                            {
                                fetchFinished
                                && <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <button className={"button"}
                                            onClick={() => {
                                                setEscapeKey(!escapeKey)
                                            }}
                                    >
                                        Resume
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
            <canvas style={{border: '1px solid #000000'}}
                    ref={canvasRef}
            />
        </div>
    );
};

export default Gallery;
