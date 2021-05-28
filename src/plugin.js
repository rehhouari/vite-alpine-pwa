import path from 'path';
import fg from 'fast-glob';
import fs from 'fs';
import * as ts from 'typescript';

export const plugin = () => {
	let generatedRoutes = null;
	const extensions = ['html', 'ts', 'js', 'md'];
	const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`);
	const extensionRE = /(?:\.([^.]+))?$/;
	var dynamicRouteRE = /^\[.+\]$/;
	function slash(str) {
		return str.replace(/\\/g, '/');
	}
	async function getPageFiles(path) {
		const ext = extensionsToGlob(extensions);
		const files = await fg(`**/*.${ext}`, {
			ignore: ['node_modules', '.git', '**/__*__/**'],
			onlyFiles: true,
			cwd: path,
		});
		return files;
	}
	function extensionsToGlob(extensions) {
		return extensions.length > 1
			? `{${extensions.join(',')}}`
			: extensions[0] || '';
	}
	function isDynamicRoute(routePath) {
		return dynamicRouteRE.test(routePath);
	}
	function isCatchAllRoute(routePath) {
		return /^\[\.{3}/.test(routePath);
	}

	function relativePath(path) {
		return '.' + path.match(/(\/src\/pages\/.+)/gi)[0];
	}

	var html = '<div x-data="router()" x-router>';
	var routeTemplate =
		'<template x-route="{route}" x-view="{view}" x-handler="{handler}"></template>';
	return {
		name: 'plugin',
		transforms: [
			{
				test: ({ path }) => path.endsWith('.html') || path.endsWith('.md'),
				transform({ code }) {
					return `export default ${JSON.stringify(code)}`;
				},
			},
		],
		async transformIndexHtml(h) {
			if (!generatedRoutes) {
				generatedRoutes = null;
				const pageDirPath = slash(path.resolve('src/pages'));
				let filesPath = await getPageFiles(pageDirPath);
				let pagesDir = pageDirPath;
				const routes = [];
				for (const filePath of filesPath) {
					const resolvedPath = filePath.replace(extensionsRE, '');
					const pathNodes = resolvedPath.split('/');
					const component = `/${pagesDir}/${filePath}`;
					const route = {
						name: '',
						path: '',
						component,
					};
					let parentRoutes = routes;
					for (let i = 0; i < pathNodes.length; i++) {
						const node = pathNodes[i];
						const isDynamic = isDynamicRoute(node);
						const isCatchAll = isCatchAllRoute(node);
						const normalizedName = isDynamic
							? false
								? isCatchAll
									? 'all'
									: node.replace(/^_/, '')
								: node
										.replace(/^\[(\.{3})?/, '')
										.replace(/\]$/, '')
							: node;
						const normalizedPath = normalizedName.toLowerCase();
						console.log(normalizedName);
						route.name += route.name
							? `-${normalizedName}`
							: normalizedName;
						const parent = parentRoutes.find(
							(node2) => node2.name === route.name
						);
						if (parent) {
							parent.children = parent.children || [];
							parentRoutes = parent.children;
							route.path = '';
						} else if (normalizedName === 'index' && !route.path) {
							route.path += '/';
						} else if (normalizedName !== 'index') {
							if (isDynamic) {
								route.path += `/:${normalizedName}`;
								if (isCatchAll) route.path += '(.*)';
							} else {
								route.path += `/${normalizedPath}`;
							}
						}
					}
					ext = extensionRE.exec(route.component);
					if (ext & (route.name != 'index')) route.name += ext[0];
					route.isHandler = ['js', 'ts'].includes(ext[1]);
					if (ext[0] == '.md') {
						console.log(await import(relativePath(route.component)));
					}
					parentRoutes.push(route);
				}

				let templates = {};
				for (index in routes) {
					const route = routes[index];
					if (route.path == '/notfound') route.path = 'notfound';

					if (route.children != null) {
						const handler = route.children[0];
						let relativeLink = relativePath(handler.component);
						let tsModule = null;
						if (relativeLink.endsWith('.ts')) {
							let data = fs.readFileSync(relativeLink, 'utf-8');

							let js = ts.transpileModule(data, {
								compilerOptions: {
									module: ts.ModuleKind.ES2015,
								},
							});
							tsModule =
								'data:text/javascript;base64,' +
								Buffer.from(js.outputText).toString('base64');
						}
						let handlerFunction = (
							await import(tsModule ?? relativeLink)
						).default;
						let handlerString = handlerFunction
							.toString()
							.replace(/\r?\n|\r|\s/g, '');
						if (templates[route.name]) {
							templates[route.name] = templates[
								route.name
							].replace('{handler}', handlerString);
							return;
						} else {
							templates[route.name] = routeTemplate
								.replace('{route}', route.path)
								.replace('{handler}', handlerString);
						}
					}

					fs.copyFile(
						route.component,
						'./public/pages/' + route.name,
						(err) => {
							if (err) throw err;
						}
					);

					if (templates[route.name]) {
						templates[route.name] = templates[route.name].replace(
							'{view}',
							route.name
						);
					} else {
						templates[route.name] = routeTemplate
							.replace('{route}', route.path)
							.replace('{view}', route.name);
					}
				}
				for (index in templates) {
					html += templates[index]
						.replace('x-handler="{handler}"', '')
						.replace('x-view="{view}"', '');
				}
				html += '</div>';
			}
			h = h.replace('<body>', '<body>' + html);
			return h;
		},
		handleHotUpdate({ file, server }) {
			let parts = file.split('/');
			if (parts.includes('pages')) {
				generatedRoutes = null;
				return server.ws.send({
					type: 'full-reload',
				});
			}
		},
	};
};
