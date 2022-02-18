import React from 'react'
import { Link } from 'react-router-dom'

export class Navbar extends React.Component {
    render() {
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div class='container'>
                        <a class="navbar-brand" href='/'>Proyecto 1</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto">
                                <li class="nav-item active">
                                    <Link to='/'>
                                        <a class="nav-link">Datos</a>
                                    </Link>
                                </li>
                                <li class="nav-item active">
                                    <Link to='/cpu'>
                                        <a class="nav-link" >CPU</a>
                                    </Link>
                                </li>
                                <li class="nav-item active">
                                    <Link to='/memory'>
                                        <a class="nav-link" >Memoria</a>
                                    </Link>
                                </li>
                                <li class="nav-item active">
                                    <Link to='/tree'>
                                        <a class="nav-link" >Arbol</a>
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