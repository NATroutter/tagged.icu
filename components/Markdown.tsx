'use client'

import * as React from "react";
import MarkdownIt from "markdown-it";

export interface MarkdownProps {
	content: string
	className?: string;
}

export default function Markdown({ content, className } : MarkdownProps ) {
	const md = new MarkdownIt({
		html: true,
		linkify: true,
		typographer: true
	});

	const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};

	md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
		const token = tokens[idx];
		const hrefIndex = token.attrIndex('target');
		if (!token.attrs) return defaultRender(tokens, idx, options, env, self);

		if (hrefIndex < 0) {
			token.attrPush(['target', '_blank']);
		} else {
			token.attrs[hrefIndex][1] = '_blank';
		}
		return defaultRender(tokens, idx, options, env, self);
	};

	return (<div className={`markdown-body${className ? " "+className : ""}`} dangerouslySetInnerHTML={{__html: md.render(content)}}></div>)
}