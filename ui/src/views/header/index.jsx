// @flow

import {
    header,
    support,
    topnav,
    nav,
    logo,
    dropdown,
} from './style.css';

export default () => (
    <header style={header}>
        <div style={support}>become a supporter</div>
        <ul style={topnav}>
            <li>subscribe</li>
            <li>find a job</li>
            <li>sign in </li>
            <li>search</li>
        </ul>
        <h1 style={logo}>the guardian</h1>
        <nav>
            <ul style={nav}>
                <li>news</li>
                <li>opinion</li>
                <li>sport</li>
                <li>arts</li>
                <li>lifestyle</li>
                <li style={dropdown}>sections</li>
            </ul>
        </nav>
    </header>
);
