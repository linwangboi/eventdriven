import React, { useEffect, useState } from "react";

const Delivery = () => {
    const [state, setState] = useState({
    "id": "01KBHVPBYQ7ER4A5BRQZ3QB72A",
    "budget": 50,
    "notes": "Pick 2 burgers",
    "status": "ready"
    });
    useEffect(() => {
        (async () => {
            const response = await fetch("https://effective-waddle-r4pv4vxwv744cxvv5-8000.app.github.dev/event")
        })()
    }, [])
    const submit = async (e, type) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());
        const response = await fetch("https://effective-waddle-r4pv4vxwv744cxvv5-8000.app.github.dev/event", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                type,
                data
            })
        });
        if (!response.ok) {
            const {detail} = await response.json();
            alert(detail);
            return;
        }
        
    }
    return (
        <div className="row w-100">
            <div className="col-12 mb-4">
                <h4 className="fw-bold text-white">Delivery {state.id}</h4>
            </div>
            <div className="col-12 mb-5">
                <div className="progress">
                    {
                        state.status !== 'ready'? 
                        <div className={ state.status === 'active' ? "progress-bar bg-success progress-bar-striped progress-bar-animated" : "progress-bar bg-success"} 
                        role="progressbar" style={{width: "50%"}}></div> : '' 
                    }
                    {
                        state.status === 'collected' || state.status === 'completed' ? 
                        <div className={ state.status === 'collected' ? "progress-bar bg-success progress-bar-striped progress-bar-animated" : "progress-bar bg-success"} 
                        role="progressbar" style={{width: "50%"}}></div> : '' 
                    }                
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Start Delivery
                    </div>
                    <form className="card-body" onSubmit={e => submit(e, 'START_DELIVERY')}>
                        <button className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Increase Budget
                    </div>
                    <form className="card-body" onSubmit={e => submit(e, 'INCREASE_BUDGET')}>
                        <div className="input-group mb-3">
                            <input type="number" name="budget" className="form-control" placeholder="Budget"/>
                        </div>
                        <button className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Pickup Products
                    </div>
                    <form className="card-body" onSubmit={e => submit(e, 'PICKUP_PRODUCTS')}>
                        <div className="input-group mb-3">
                            <input type="number" name="purchase_price" className="form-control" placeholder="Purchase Price"/>
                            <input type="number" name="quantity" className="form-control" placeholder="Quantity"/>
                        </div>
                        <button className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Deliver Products
                    </div>
                    <form className="card-body" onSubmit={e => submit(e, 'DELIVER_PRODUCTS')}>
                        <div className="input-group mb-3">
                            <input type="number" name="sell_price" className="form-control" placeholder="Sell Price"/>
                            <input type="number" name="quantity" className="form-control" placeholder="Quantity"/>
                        </div>
                        <button className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Delivery;