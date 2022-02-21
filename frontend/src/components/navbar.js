import React from 'react'
import { Link } from 'react-router-dom'

export class Navbar extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className='container'>
                        <a className="navbar-brand" href='/'>Práctica 1</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link to='/'>
                                        <a className="nav-link">Datos</a>
                                    </Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to='/cpu'>
                                        <a className="nav-link" >CPU</a>
                                    </Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to='/memory'>
                                        <a className="nav-link" >Memoria</a>
                                    </Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to='/tree'>
                                        <a className="nav-link" >Arbol</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}