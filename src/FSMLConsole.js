/* eslint-disable */

import './FSMLConsole.css';
import * as React from 'react';

import { get_fsml_instance } from 'fsmlang';


const fsml = get_fsml_instance ();
const item_separator = " -> ";
const ONLY = 0;


class FSMLConsole extends React .Component {

	constructor (props) {
		super (props);

		this .state = {};
		this .state .text = '';
		this .send_news = this .send_news .bind (this); }

	send_news (news) {
		const text = this .state .text + news;
		this .setState ({ text: text }); }

	render () {
		return (
			<div className='fsml-console'>
				<Fsmlogo />
				<Fsmlog text = { this .state .text } />
				<Inbox  send_news = { this .send_news } />
			</div>); }
}


class Fsmlogo extends React .Component {

  constructor (props) {
		super (props);

		this .state = {};

		this .state .text =
			"\n\
			==========================================================\n\
                                        FSML                          \n\
			==========================================================\n\
			\n\
			FSML 0.3.7, (c) 2021, 2022 Alexander (Shurko) Stadnichenko\n\
			Type 'help' to FSML help you,\n\
			'license' to view BSD license, 'bb' to farewell\n"; }

	render = () =>
		(<div
			className = "fsmlogo ws-pre"
			children = { this .state .text }
		/>);
}


class Fsmlog extends React .Component {
	constructor (props) { super (props) }

	render = () =>
		<div className = 'fsmlog ws-pre' children = { this .props .text } />;
}


class Inbox extends React .Component {

	constructor (props)
	{
		super (props);

		this .state = {};
		this .state .text = '';
		this .enter_handler = this .enter_handler .bind (this);
		this .change_handler = this .change_handler .bind (this);

		// If autofocus fail
		setTimeout (() =>
			document .getElementsByClassName ('inbox') [ONLY] .focus (), 2000);
	}

	enter_handler (evt) {
		evt .preventDefault ();
		const fsml_console =
			evt .target .parentElement .parentElement;

		const scroll_amount = 1000;
		const delay_before_scroll = 200;
		
		let send_news = this .props .send_news;
		let logtext = this .state .text ? '\n\n' + this .state .text : '';
		let eval_result = fsml .eval (this .state .text) || '';

		if (eval_result)
			logtext += '\n\n' + eval_result;
		
		const stack = fsml .stack .type ();
		logtext += '\n\n' + '[' + fsml .stack .depth () + ']  ';

		if (stack .length)
			logtext += stack. join (item_separator);

		this .setState ({ text: '' });
		send_news (logtext);

		/* Scroll for show prompt */
		setTimeout
			(() => fsml_console
				.scrollBy (0, scroll_amount),
			delay_before_scroll); }

	change_handler = evt =>
		this .setState ({ text: evt .target .value });

	render = () =>
		(<div  className= 'inbox-wrapper'>
			<div className='prompt'>{'fsml >'}</div>
		  
			<form className = 'inputform' onSubmit = { this .enter_handler } >
				<input onChange = { this .change_handler }
					name = "inbox"
					className = "inbox"
					autoFocus
					value = { this .state .text } />
			</form>
		</div>);
}


export { FSMLConsole };
