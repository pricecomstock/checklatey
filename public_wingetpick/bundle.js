
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group) {
        const value = [];
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.push(group[i].__value);
        }
        return value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(changed, child_ctx);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }

    function bind(component, name, callback) {
        if (component.$$.props.indexOf(name) === -1)
            return;
        component.$$.bound[name] = callback;
        callback(component.$$.ctx[name]);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/Category.svelte generated by Svelte v3.12.1 */

    const file = "src/components/Category.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.app = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (53:2) {#each apps as app, i (app.name)}
    function create_each_block(key_1, ctx) {
    	var div, label, input, input_value_value, t0, t1_value = ctx.app.name + "", t1, t2, dispose;

    	const block = {
    		key: key_1,

    		first: null,

    		c: function create() {
    			div = element("div");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			ctx.$$binding_groups[0].push(input);
    			attr_dev(input, "type", "checkbox");
    			input.__value = input_value_value = ctx.app;
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-e3zqrc");
    			add_location(input, file, 55, 8, 986);
    			attr_dev(label, "class", "fill-box svelte-e3zqrc");
    			add_location(label, file, 54, 6, 953);
    			attr_dev(div, "class", "application svelte-e3zqrc");
    			toggle_class(div, "chosen", ctx.appsAreSelected[ctx.i]);
    			add_location(div, file, 53, 4, 887);
    			dispose = listen_dev(input, "change", ctx.input_change_handler);
    			this.first = div;
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, input);

    			input.checked = ~ctx.selectedApps.indexOf(input.__value);

    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(div, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.selectedApps) input.checked = ~ctx.selectedApps.indexOf(input.__value);

    			if ((changed.apps) && input_value_value !== (input_value_value = ctx.app)) {
    				prop_dev(input, "__value", input_value_value);
    			}

    			input.value = input.__value;

    			if ((changed.apps) && t1_value !== (t1_value = ctx.app.name + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if ((changed.appsAreSelected || changed.apps)) {
    				toggle_class(div, "chosen", ctx.appsAreSelected[ctx.i]);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input), 1);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(53:2) {#each apps as app, i (app.name)}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div, h2, i, i_class_value, t0, t1, t2, each_blocks = [], each_1_lookup = new Map();

    	let each_value = ctx.apps;

    	const get_key = ctx => ctx.app.name;

    	for (let i_1 = 0; i_1 < each_value.length; i_1 += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i_1);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i_1] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			i = element("i");
    			t0 = space();
    			t1 = text(ctx.name);
    			t2 = space();

    			for (let i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
    				each_blocks[i_1].c();
    			}
    			attr_dev(i, "class", i_class_value = "" + null_to_empty(ctx.icon) + " svelte-e3zqrc");
    			add_location(i, file, 49, 4, 809);
    			attr_dev(h2, "class", "category-name svelte-e3zqrc");
    			add_location(h2, file, 48, 2, 778);
    			attr_dev(div, "class", "category category svelte-e3zqrc");
    			add_location(div, file, 47, 0, 744);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div, t2);

    			for (let i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
    				each_blocks[i_1].m(div, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if ((changed.icon) && i_class_value !== (i_class_value = "" + null_to_empty(ctx.icon) + " svelte-e3zqrc")) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (changed.name) {
    				set_data_dev(t1, ctx.name);
    			}

    			const each_value = ctx.apps;
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			for (let i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
    				each_blocks[i_1].d();
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { name = "???", icon = "???", apps = [], selectedApps = [] } = $$props;

    	const writable_props = ['name', 'icon', 'apps', 'selectedApps'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Category> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		selectedApps = get_binding_group_value($$binding_groups[0]);
    		$$invalidate('selectedApps', selectedApps);
    	}

    	$$self.$set = $$props => {
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    		if ('icon' in $$props) $$invalidate('icon', icon = $$props.icon);
    		if ('apps' in $$props) $$invalidate('apps', apps = $$props.apps);
    		if ('selectedApps' in $$props) $$invalidate('selectedApps', selectedApps = $$props.selectedApps);
    	};

    	$$self.$capture_state = () => {
    		return { name, icon, apps, selectedApps, appsAreSelected };
    	};

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    		if ('icon' in $$props) $$invalidate('icon', icon = $$props.icon);
    		if ('apps' in $$props) $$invalidate('apps', apps = $$props.apps);
    		if ('selectedApps' in $$props) $$invalidate('selectedApps', selectedApps = $$props.selectedApps);
    		if ('appsAreSelected' in $$props) $$invalidate('appsAreSelected', appsAreSelected = $$props.appsAreSelected);
    	};

    	let appsAreSelected;

    	$$self.$$.update = ($$dirty = { apps: 1, selectedApps: 1 }) => {
    		if ($$dirty.apps || $$dirty.selectedApps) { $$invalidate('appsAreSelected', appsAreSelected = apps.map(app => {
            return selectedApps.includes(app);
          })); }
    	};

    	return {
    		name,
    		icon,
    		apps,
    		selectedApps,
    		appsAreSelected,
    		input_change_handler,
    		$$binding_groups
    	};
    }

    class Category extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["name", "icon", "apps", "selectedApps"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Category", options, id: create_fragment.name });
    	}

    	get name() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get apps() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set apps(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedApps() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedApps(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/AppSelector.svelte generated by Svelte v3.12.1 */

    const file$1 = "src/components/AppSelector.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.category = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (43:4) {#each appsByCategory as category, i (category.categoryName)}
    function create_each_block$1(key_1, ctx) {
    	var first, updating_selectedApps, current;

    	function category_selectedApps_binding(value) {
    		ctx.category_selectedApps_binding.call(null, value, ctx);
    		updating_selectedApps = true;
    		add_flush_callback(() => updating_selectedApps = false);
    	}

    	let category_props = {
    		name: ctx.category.categoryName,
    		icon: ctx.category.categoryIcon,
    		apps: ctx.category.apps
    	};
    	if (ctx.selectedByCategory[ctx.i].selected !== void 0) {
    		category_props.selectedApps = ctx.selectedByCategory[ctx.i].selected;
    	}
    	var category = new Category({ props: category_props, $$inline: true });

    	binding_callbacks.push(() => bind(category, 'selectedApps', category_selectedApps_binding));

    	const block = {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			category.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(category, target, anchor);
    			current = true;
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			var category_changes = {};
    			if (changed.appsByCategory) category_changes.name = ctx.category.categoryName;
    			if (changed.appsByCategory) category_changes.icon = ctx.category.categoryIcon;
    			if (changed.appsByCategory) category_changes.apps = ctx.category.apps;
    			if (!updating_selectedApps && changed.selectedByCategory || changed.appsByCategory) {
    				category_changes.selectedApps = ctx.selectedByCategory[ctx.i].selected;
    			}
    			category.$set(category_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(category.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(category.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(first);
    			}

    			destroy_component(category, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(43:4) {#each appsByCategory as category, i (category.categoryName)}", ctx });
    	return block;
    }

    function create_fragment$1(ctx) {
    	var div1, h1, t_1, div0, each_blocks = [], each_1_lookup = new Map(), current;

    	let each_value = ctx.appsByCategory;

    	const get_key = ctx => ctx.category.categoryName;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Select the apps you want to install!";
    			t_1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(h1, file$1, 40, 2, 648);
    			attr_dev(div0, "class", "apps svelte-iqa3uq");
    			add_location(div0, file$1, 41, 2, 696);
    			add_location(div1, file$1, 39, 0, 640);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t_1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.appsByCategory;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { appsByCategory, selectedByCategory } = $$props;

    	const writable_props = ['appsByCategory', 'selectedByCategory'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<AppSelector> was created with unknown prop '${key}'`);
    	});

    	function category_selectedApps_binding(value, { i }) {
    		selectedByCategory[i].selected = value;
    		$$invalidate('selectedByCategory', selectedByCategory);
    	}

    	$$self.$set = $$props => {
    		if ('appsByCategory' in $$props) $$invalidate('appsByCategory', appsByCategory = $$props.appsByCategory);
    		if ('selectedByCategory' in $$props) $$invalidate('selectedByCategory', selectedByCategory = $$props.selectedByCategory);
    	};

    	$$self.$capture_state = () => {
    		return { appsByCategory, selectedByCategory };
    	};

    	$$self.$inject_state = $$props => {
    		if ('appsByCategory' in $$props) $$invalidate('appsByCategory', appsByCategory = $$props.appsByCategory);
    		if ('selectedByCategory' in $$props) $$invalidate('selectedByCategory', selectedByCategory = $$props.selectedByCategory);
    	};

    	return {
    		appsByCategory,
    		selectedByCategory,
    		category_selectedApps_binding
    	};
    }

    class AppSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["appsByCategory", "selectedByCategory"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "AppSelector", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.appsByCategory === undefined && !('appsByCategory' in props)) {
    			console.warn("<AppSelector> was created without expected prop 'appsByCategory'");
    		}
    		if (ctx.selectedByCategory === undefined && !('selectedByCategory' in props)) {
    			console.warn("<AppSelector> was created without expected prop 'selectedByCategory'");
    		}
    	}

    	get appsByCategory() {
    		throw new Error("<AppSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appsByCategory(value) {
    		throw new Error("<AppSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedByCategory() {
    		throw new Error("<AppSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedByCategory(value) {
    		throw new Error("<AppSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function t(t,e,n,r){return new(n||(n=Promise))(function(o,i){function a(t){try{u(r.next(t));}catch(t){i(t);}}function c(t){try{u(r.throw(t));}catch(t){i(t);}}function u(t){t.done?o(t.value):new n(function(e){e(t.value);}).then(a,c);}u((r=r.apply(t,e||[])).next());})}function e(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a);}catch(t){i=[6,t],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}var n=["text/plain","text/html"];var r=function(){(console.warn||console.log).call(arguments);}.bind(console,"[clipboard-polyfill]"),o=!0;var i=function(){function t(){this.m={};}return t.prototype.setData=function(t,e){o&&-1===n.indexOf(t)&&r("Unknown data type: "+t,"Call clipboard.suppressWarnings() to suppress this warning."),this.m[t]=e;},t.prototype.getData=function(t){return this.m[t]},t.prototype.forEach=function(t){for(var e in this.m)t(this.m[e],e);},t}(),a=function(t){},c=!0;var u=function(){(console.warn||console.log).apply(console,arguments);}.bind("[clipboard-polyfill]"),s="text/plain";function f(n){return t(this,void 0,void 0,function(){var t;return e(this,function(e){if(c&&!n.getData(s)&&u("clipboard.write() was called without a `text/plain` data type. On some platforms, this may result in an empty clipboard. Call clipboard.suppressWarnings() to suppress this warning."),C()){if(function(t){var e=t.getData(s);if(void 0!==e)return window.clipboardData.setData("Text",e);throw new Error("No `text/plain` value was specified.")}(n))return [2];throw new Error("Copying failed, possibly because the user rejected it.")}if(g(n))return a("regular execCopy worked"),[2];if(navigator.userAgent.indexOf("Edge")>-1)return a('UA "Edge" => assuming success'),[2];if(x(document.body,n))return a("copyUsingTempSelection worked"),[2];if(function(t){var e=document.createElement("div");e.setAttribute("style","-webkit-user-select: text !important"),e.textContent="temporary element",document.body.appendChild(e);var n=x(e,t);return document.body.removeChild(e),n}(n))return a("copyUsingTempElem worked"),[2];if(void 0!==(t=n.getData(s))&&function(t){a("copyTextUsingDOM");var e=document.createElement("div");e.setAttribute("style","-webkit-user-select: text !important");var n=e;e.attachShadow&&(a("Using shadow DOM."),n=e.attachShadow({mode:"open"}));var r=document.createElement("span");r.innerText=t,n.appendChild(r),document.body.appendChild(e),D(r);var o=document.execCommand("copy");return E(),document.body.removeChild(e),o}(t))return a("copyTextUsingDOM worked"),[2];throw new Error("Copy command failed.")})})}function p(n){return t(this,void 0,void 0,function(){return e(this,function(t){return navigator.clipboard&&navigator.clipboard.writeText?(a("Using `navigator.clipboard.writeText()`."),[2,navigator.clipboard.writeText(n)]):[2,f(T(n))]})})}var y=function(){this.success=!1;};function g(t){var e=new y,n=function(t,e,n){a("listener called"),t.success=!0,e.forEach(function(e,r){var o=n.clipboardData;o.setData(r,e),r===s&&o.getData(r)!==e&&(a("setting text/plain failed"),t.success=!1);}),n.preventDefault();}.bind(this,e,t);document.addEventListener("copy",n);try{document.execCommand("copy");}finally{document.removeEventListener("copy",n);}return e.success}function x(t,e){D(t);var n=g(e);return E(),n}function D(t){var e=document.getSelection();if(e){var n=document.createRange();n.selectNodeContents(t),e.removeAllRanges(),e.addRange(n);}}function E(){var t=document.getSelection();t&&t.removeAllRanges();}function T(t){var e=new i;return e.setData(s,t),e}function C(){return "undefined"==typeof ClipboardEvent&&void 0!==window.clipboardData&&void 0!==window.clipboardData.setData}

    /* src/components/Output.svelte generated by Svelte v3.12.1 */
    const { console: console_1 } = globals;

    const file$2 = "src/components/Output.svelte";

    function create_fragment$2(ctx) {
    	var div2, h1, t1, p, t2, a0, t4, t5, br0, t6, div1, button, t8, div0, pre, t9, t10, hr, t11, fieldset, legend, t13, label0, input0, t14, t15, br1, t16, label1, input1, t17, t18, br2, t19, label2, input2, t20, a1, t22, dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Then run this command in an Administrator PowerShell!";
    			t1 = space();
    			p = element("p");
    			t2 = text("Make sure you've\n    ");
    			a0 = element("a");
    			a0.textContent = "installed Chocolatey";
    			t4 = text("\n    or enabled the extremely irresponsible option below to do so.");
    			t5 = space();
    			br0 = element("br");
    			t6 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Copy to Clipboard";
    			t8 = space();
    			div0 = element("div");
    			pre = element("pre");
    			t9 = text(ctx.chocolateyCommand);
    			t10 = space();
    			hr = element("hr");
    			t11 = space();
    			fieldset = element("fieldset");
    			legend = element("legend");
    			legend.textContent = "Options";
    			t13 = space();
    			label0 = element("label");
    			input0 = element("input");
    			t14 = text("\n      Don't prompt for user input (yes to everything)");
    			t15 = space();
    			br1 = element("br");
    			t16 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t17 = text("\n      Prefer portable installs");
    			t18 = space();
    			br2 = element("br");
    			t19 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t20 = text("\n      Also Install Chocolatey (this is bad practice!) (nothing bad that happens\n      is my fault!)\n      ");
    			a1 = element("a");
    			a1.textContent = "(you should read this!)";
    			t22 = text("\n      (yes, you are piping a script into an administrator PowerShell!)");
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$2, 54, 2, 1196);
    			attr_dev(a0, "href", "https://chocolatey.org/docs/installation#install-with-powershellexe");
    			add_location(a0, file$2, 57, 4, 1304);
    			add_location(p, file$2, 55, 2, 1275);
    			add_location(br0, file$2, 63, 2, 1500);
    			attr_dev(button, "class", "btn");
    			add_location(button, file$2, 66, 4, 1546);
    			attr_dev(pre, "id", "output");
    			attr_dev(pre, "class", "svelte-3g8e20");
    			add_location(pre, file$2, 70, 6, 1722);
    			attr_dev(div0, "class", "box shadow dangerable svelte-3g8e20");
    			toggle_class(div0, "danger-border", ctx.alsoInstallChocolatey);
    			add_location(div0, file$2, 67, 4, 1624);
    			attr_dev(div1, "class", "output-min-height svelte-3g8e20");
    			add_location(div1, file$2, 65, 2, 1510);
    			add_location(hr, file$2, 73, 2, 1787);
    			add_location(legend, file$2, 76, 4, 1875);
    			attr_dev(input0, "type", "checkbox");
    			add_location(input0, file$2, 78, 6, 1935);
    			attr_dev(label0, "class", "checkbox");
    			add_location(label0, file$2, 77, 4, 1904);
    			add_location(br1, file$2, 81, 4, 2054);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$2, 83, 6, 2096);
    			attr_dev(label1, "class", "checkbox");
    			add_location(label1, file$2, 82, 4, 2065);
    			add_location(br2, file$2, 86, 4, 2200);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$2, 88, 6, 2249);
    			attr_dev(a1, "href", "https://chocolatey.org/docs/installation#install-with-powershellexe");
    			add_location(a1, file$2, 91, 6, 2418);
    			attr_dev(label2, "class", "checkbox danger svelte-3g8e20");
    			add_location(label2, file$2, 87, 4, 2211);
    			attr_dev(fieldset, "class", "box shadow");
    			add_location(fieldset, file$2, 75, 2, 1841);
    			add_location(div2, file$2, 53, 0, 1188);

    			dispose = [
    				listen_dev(button, "click", ctx.copyToClipboard),
    				listen_dev(input0, "change", ctx.input0_change_handler),
    				listen_dev(input1, "change", ctx.input1_change_handler),
    				listen_dev(input2, "change", ctx.input2_change_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, p);
    			append_dev(p, t2);
    			append_dev(p, a0);
    			append_dev(p, t4);
    			append_dev(div2, t5);
    			append_dev(div2, br0);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(div1, t8);
    			append_dev(div1, div0);
    			append_dev(div0, pre);
    			append_dev(pre, t9);
    			append_dev(div2, t10);
    			append_dev(div2, hr);
    			append_dev(div2, t11);
    			append_dev(div2, fieldset);
    			append_dev(fieldset, legend);
    			append_dev(fieldset, t13);
    			append_dev(fieldset, label0);
    			append_dev(label0, input0);

    			input0.checked = ctx.sayYes;

    			append_dev(label0, t14);
    			append_dev(fieldset, t15);
    			append_dev(fieldset, br1);
    			append_dev(fieldset, t16);
    			append_dev(fieldset, label1);
    			append_dev(label1, input1);

    			input1.checked = ctx.preferPortable;

    			append_dev(label1, t17);
    			append_dev(fieldset, t18);
    			append_dev(fieldset, br2);
    			append_dev(fieldset, t19);
    			append_dev(fieldset, label2);
    			append_dev(label2, input2);

    			input2.checked = ctx.alsoInstallChocolatey;

    			append_dev(label2, t20);
    			append_dev(label2, a1);
    			append_dev(label2, t22);
    		},

    		p: function update(changed, ctx) {
    			if (changed.chocolateyCommand) {
    				set_data_dev(t9, ctx.chocolateyCommand);
    			}

    			if (changed.alsoInstallChocolatey) {
    				toggle_class(div0, "danger-border", ctx.alsoInstallChocolatey);
    			}

    			if (changed.sayYes) input0.checked = ctx.sayYes;
    			if (changed.preferPortable) input1.checked = ctx.preferPortable;
    			if (changed.alsoInstallChocolatey) input2.checked = ctx.alsoInstallChocolatey;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div2);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    const chocolateyInstallCommand =
        "Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))\n";

    function instance$2($$self, $$props, $$invalidate) {
    	let preferPortable = false;
      let sayYes = true;
      let alsoInstallChocolatey = false;

      let { allSelected = [] } = $$props;

      function copyToClipboard() {
        p(chocolateyCommand).catch(e => console.log(e));
      }

    	const writable_props = ['allSelected'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Output> was created with unknown prop '${key}'`);
    	});

    	function input0_change_handler() {
    		sayYes = this.checked;
    		$$invalidate('sayYes', sayYes);
    	}

    	function input1_change_handler() {
    		preferPortable = this.checked;
    		$$invalidate('preferPortable', preferPortable);
    	}

    	function input2_change_handler() {
    		alsoInstallChocolatey = this.checked;
    		$$invalidate('alsoInstallChocolatey', alsoInstallChocolatey);
    	}

    	$$self.$set = $$props => {
    		if ('allSelected' in $$props) $$invalidate('allSelected', allSelected = $$props.allSelected);
    	};

    	$$self.$capture_state = () => {
    		return { preferPortable, sayYes, alsoInstallChocolatey, allSelected, chocolateyCommand };
    	};

    	$$self.$inject_state = $$props => {
    		if ('preferPortable' in $$props) $$invalidate('preferPortable', preferPortable = $$props.preferPortable);
    		if ('sayYes' in $$props) $$invalidate('sayYes', sayYes = $$props.sayYes);
    		if ('alsoInstallChocolatey' in $$props) $$invalidate('alsoInstallChocolatey', alsoInstallChocolatey = $$props.alsoInstallChocolatey);
    		if ('allSelected' in $$props) $$invalidate('allSelected', allSelected = $$props.allSelected);
    		if ('chocolateyCommand' in $$props) $$invalidate('chocolateyCommand', chocolateyCommand = $$props.chocolateyCommand);
    	};

    	let chocolateyCommand;

    	$$self.$$.update = ($$dirty = { alsoInstallChocolatey: 1, sayYes: 1, allSelected: 1, preferPortable: 1 }) => {
    		if ($$dirty.alsoInstallChocolatey || $$dirty.sayYes || $$dirty.allSelected || $$dirty.preferPortable) { $$invalidate('chocolateyCommand', chocolateyCommand = `${
        alsoInstallChocolatey ? chocolateyInstallCommand : ""
      }choco install ${sayYes ? "-y" : ""} ${allSelected
        .map(app => {
          return preferPortable ? app.chocoPortable : app.chocoPackage;
        })
        .join(" ")}`); }
    	};

    	return {
    		preferPortable,
    		sayYes,
    		alsoInstallChocolatey,
    		allSelected,
    		copyToClipboard,
    		chocolateyCommand,
    		input0_change_handler,
    		input1_change_handler,
    		input2_change_handler
    	};
    }

    class Output extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["allSelected"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Output", options, id: create_fragment$2.name });
    	}

    	get allSelected() {
    		throw new Error("<Output>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allSelected(value) {
    		throw new Error("<Output>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function App(name, category, chocoPackage, chocoPortable, faIcon) {
      chocoPortable = chocoPortable || chocoPackage;

      this.name = name;
      this.category = category;
      this.chocoPackage = chocoPackage;
      this.chocoPortable = chocoPortable;

      this.faIcon = faIcon || ""; // should be "fas fa-search" or "fab fa-google"

      this.portableAvailable = this.chocoPackage !== this.chocoPortable;
    }
    // module.exports = app;

    var appCsv = [ { shortName:"firefox",
        properName:"Mozilla Firefox",
        category:"BROWSERS",
        chocoInstallPackage:"firefox",
        chocoPortablePackage:"firefox",
        wingetPackage:"Mozilla.Firefox",
        scoopPackage:"" },
      { shortName:"chrome",
        properName:"Google Chrome",
        category:"BROWSERS",
        chocoInstallPackage:"googlechrome",
        chocoPortablePackage:"googlechrome",
        wingetPackage:"Google.Chrome",
        scoopPackage:"" },
      { shortName:"chromium",
        properName:"Chromium",
        category:"BROWSERS",
        chocoInstallPackage:"chromium",
        chocoPortablePackage:"chromium",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"vivaldi",
        properName:"Vivaldi",
        category:"BROWSERS",
        chocoInstallPackage:"vivaldi",
        chocoPortablePackage:"vivaldi",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"opera",
        properName:"Opera",
        category:"BROWSERS",
        chocoInstallPackage:"opera",
        chocoPortablePackage:"opera",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"brave",
        properName:"Brave",
        category:"BROWSERS",
        chocoInstallPackage:"brave",
        chocoPortablePackage:"brave",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"discord",
        properName:"Discord",
        category:"MESSAGING",
        chocoInstallPackage:"discord.install",
        chocoPortablePackage:"discord",
        wingetPackage:"Discord.Discord",
        scoopPackage:"" },
      { shortName:"slack",
        properName:"Slack",
        category:"MESSAGING",
        chocoInstallPackage:"slack",
        chocoPortablePackage:"slack",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"skype",
        properName:"Skype",
        category:"MESSAGING",
        chocoInstallPackage:"skype",
        chocoPortablePackage:"skype",
        wingetPackage:"Microsoft.Skype",
        scoopPackage:"" },
      { shortName:"thunderbird",
        properName:"Thunderbird",
        category:"MESSAGING",
        chocoInstallPackage:"thunderbird",
        chocoPortablePackage:"thunderbird",
        wingetPackage:"Mozilla.Thunderbird",
        scoopPackage:"" },
      { shortName:"malwarebytes",
        properName:"Malwarebytes",
        category:"SECURITY",
        chocoInstallPackage:"malwarebytes",
        chocoPortablePackage:"malwarebytes",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"avast",
        properName:"Avast Free Antivirus",
        category:"SECURITY",
        chocoInstallPackage:"avastfreeantivirus",
        chocoPortablePackage:"avastfreeantivirus",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"keepass",
        properName:"Keepass",
        category:"SECURITY",
        chocoInstallPackage:"keepass",
        chocoPortablePackage:"keepass",
        wingetPackage:"DominikReichl.KeePass",
        scoopPackage:"" },
      { shortName:"qtpass",
        properName:"QtPass",
        category:"SECURITY",
        chocoInstallPackage:"qtpass",
        chocoPortablePackage:"qtpass",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"lastpass",
        properName:"LastPass",
        category:"SECURITY",
        chocoInstallPackage:"lastpass",
        chocoPortablePackage:"lastpass",
        wingetPackage:"LogMeIn.LastPass",
        scoopPackage:"" },
      { shortName:"python",
        properName:"Python",
        category:"DEVLANGS",
        chocoInstallPackage:"python",
        chocoPortablePackage:"python",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"python2",
        properName:"Python2",
        category:"DEVLANGS",
        chocoInstallPackage:"python2",
        chocoPortablePackage:"python2",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"nodejs",
        properName:"NodeJS",
        category:"DEVLANGS",
        chocoInstallPackage:"nodejs",
        chocoPortablePackage:"nodejs",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"nodejs-lts",
        properName:"NodeJS (LTS)",
        category:"DEVLANGS",
        chocoInstallPackage:"nodejs-lts",
        chocoPortablePackage:"nodejs-lts",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"jdk8",
        properName:"JDK8",
        category:"DEVLANGS",
        chocoInstallPackage:"jdk8",
        chocoPortablePackage:"jdk8",
        wingetPackage:"AdoptOpenJDK.OpenJDK -v 8",
        scoopPackage:"" },
      { shortName:"go",
        properName:"Go",
        category:"DEVLANGS",
        chocoInstallPackage:"golang",
        chocoPortablePackage:"golang",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"rust",
        properName:"Rust",
        category:"DEVLANGS",
        chocoInstallPackage:"rust",
        chocoPortablePackage:"rust",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"ruby",
        properName:"Ruby",
        category:"DEVLANGS",
        chocoInstallPackage:"ruby",
        chocoPortablePackage:"ruby",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"php",
        properName:"PHP",
        category:"DEVLANGS",
        chocoInstallPackage:"php",
        chocoPortablePackage:"php",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"perl",
        properName:"Strawberry Perl",
        category:"DEVLANGS",
        chocoInstallPackage:"strawberryperl",
        chocoPortablePackage:"strawberryperl",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"powershell",
        properName:"PowerShell",
        category:"DEVTOOLS",
        chocoInstallPackage:"powershell",
        chocoPortablePackage:"powershell",
        wingetPackage:"Microsoft.Powershell",
        scoopPackage:"" },
      { shortName:"vscode",
        properName:"Visual Studio Code",
        category:"DEVTOOLS",
        chocoInstallPackage:"vscode",
        chocoPortablePackage:"vscode",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"notepad++",
        properName:"Notepad++",
        category:"DEVTOOLS",
        chocoInstallPackage:"notepadplusplus.install",
        chocoPortablePackage:"notepadplusplus.commandline",
        wingetPackage:"Notepad++.Notepad++",
        scoopPackage:"" },
      { shortName:"git",
        properName:"Git",
        category:"DEVTOOLS",
        chocoInstallPackage:"git",
        chocoPortablePackage:"git.portable",
        wingetPackage:"Git.Git",
        scoopPackage:"" },
      { shortName:"aws-cli",
        properName:"AWS CLI",
        category:"DEVTOOLS",
        chocoInstallPackage:"awscli",
        chocoPortablePackage:"awscli",
        wingetPackage:"Amazon.AWSCLI",
        scoopPackage:"" },
      { shortName:"azure-cli",
        properName:"Azure CLI",
        category:"DEVTOOLS",
        chocoInstallPackage:"azure-cli",
        chocoPortablePackage:"azure-cli",
        wingetPackage:"Microsoft.AzureCLI",
        scoopPackage:"" },
      { shortName:"docker-cli",
        properName:"Docker CLI",
        category:"DEVTOOLS",
        chocoInstallPackage:"docker-cli",
        chocoPortablePackage:"docker-cli",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"docker-desktop",
        properName:"Docker Desktop",
        category:"DEVTOOLS",
        chocoInstallPackage:"docker-desktop",
        chocoPortablePackage:"docker-desktop",
        wingetPackage:"Docker.DockerDesktop",
        scoopPackage:"" },
      { shortName:"docker-compose",
        properName:"docker-compose",
        category:"DEVTOOLS",
        chocoInstallPackage:"docker-compose",
        chocoPortablePackage:"docker-compose",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"ssh",
        properName:"OpenSSH",
        category:"DEVTOOLS",
        chocoInstallPackage:"openssh",
        chocoPortablePackage:"openssh",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"winscp",
        properName:"WinSCP",
        category:"DEVTOOLS",
        chocoInstallPackage:"winscp",
        chocoPortablePackage:"winscp.portable",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"filezilla",
        properName:"FileZilla",
        category:"DEVTOOLS",
        chocoInstallPackage:"filezilla",
        chocoPortablePackage:"filezilla.commandline",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"putty",
        properName:"PuTTY",
        category:"DEVTOOLS",
        chocoInstallPackage:"putty",
        chocoPortablePackage:"putty.portable",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"eclipse",
        properName:"Eclipse",
        category:"DEVTOOLS",
        chocoInstallPackage:"eclipse",
        chocoPortablePackage:"eclipse",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"arduino",
        properName:"Arduino IDE",
        category:"DEVTOOLS",
        chocoInstallPackage:"arduino",
        chocoPortablePackage:"arduino",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"curl",
        properName:"cURL",
        category:"DEVTOOLS",
        chocoInstallPackage:"curl",
        chocoPortablePackage:"curl",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"wget",
        properName:"GNU Wget",
        category:"DEVTOOLS",
        chocoInstallPackage:"wget",
        chocoPortablePackage:"wget",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"virtualbox",
        properName:"VirtualBox",
        category:"DEVTOOLS",
        chocoInstallPackage:"virtualbox",
        chocoPortablePackage:"virtualbox",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"wireshark",
        properName:"Wireshark",
        category:"DEVTOOLS",
        chocoInstallPackage:"wireshark",
        chocoPortablePackage:"wireshark",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"spotify",
        properName:"Spotify",
        category:"MEDIA",
        chocoInstallPackage:"spotify",
        chocoPortablePackage:"spotify",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"itunes",
        properName:"iTunes",
        category:"MEDIA",
        chocoInstallPackage:"itunes",
        chocoPortablePackage:"itunes",
        wingetPackage:"Apple.iTunes",
        scoopPackage:"" },
      { shortName:"vlc",
        properName:"VLC",
        category:"MEDIA",
        chocoInstallPackage:"vlc",
        chocoPortablePackage:"vlc.portable",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"foobar2000",
        properName:"foobar2000",
        category:"MEDIA",
        chocoInstallPackage:"foobar2000",
        chocoPortablePackage:"foobar2000",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"mpc-hc",
        properName:"MPC-HC",
        category:"MEDIA",
        chocoInstallPackage:"mpc-hc",
        chocoPortablePackage:"mpc-hc",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"k-lite",
        properName:"K-Lite Codec Pack (Full)",
        category:"MEDIA",
        chocoInstallPackage:"k-litecodecpackfull",
        chocoPortablePackage:"k-litecodecpackfull",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"handbrake",
        properName:"Handbrake",
        category:"MEDIA",
        chocoInstallPackage:"handbrake",
        chocoPortablePackage:"handbrake.portable",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"powertoys",
        properName:"PowerToys",
        category:"UTILITIES",
        chocoInstallPackage:"powertoys",
        chocoPortablePackage:"powertoys",
        wingetPackage:"Microsoft.PowerToys",
        scoopPackage:"" },
      { shortName:"everything",
        properName:"Everything",
        category:"UTILITIES",
        chocoInstallPackage:"everything",
        chocoPortablePackage:"everything.portable",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"teracopy",
        properName:"TeraCopy",
        category:"UTILITIES",
        chocoInstallPackage:"teracopy",
        chocoPortablePackage:"teracopy",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"treesize",
        properName:"TreeSize Free",
        category:"UTILITIES",
        chocoInstallPackage:"treesizefree",
        chocoPortablePackage:"treesizefree.portable",
        wingetPackage:"JAMSoftware.TreeSize",
        scoopPackage:"" },
      { shortName:"cpu-z",
        properName:"CPU-Z",
        category:"UTILITIES",
        chocoInstallPackage:"cpu-z.install",
        chocoPortablePackage:"cpu-z.portable",
        wingetPackage:"CPUID.CPU-Z",
        scoopPackage:"" },
      { shortName:"gpu-z",
        properName:"GPU-Z",
        category:"UTILITIES",
        chocoInstallPackage:"gpu-z.portable",
        chocoPortablePackage:"gpu-z.portable",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"imgburn",
        properName:"ImgBurn",
        category:"UTILITIES",
        chocoInstallPackage:"imgburn",
        chocoPortablePackage:"imgburn",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"etcher",
        properName:"Etcher",
        category:"UTILITIES",
        chocoInstallPackage:"etcher",
        chocoPortablePackage:"etcher",
        wingetPackage:"Balena.Etcher",
        scoopPackage:"" },
      { shortName:"rufus",
        properName:"Rufus",
        category:"UTILITIES",
        chocoInstallPackage:"rufus",
        chocoPortablePackage:"rufus",
        wingetPackage:"Rufus.Rufus",
        scoopPackage:"" },
      { shortName:"greenshot",
        properName:"Greenshot",
        category:"UTILITIES",
        chocoInstallPackage:"greenshot",
        chocoPortablePackage:"greenshot",
        wingetPackage:"Greenshot.Greenshot",
        scoopPackage:"" },
      { shortName:"autohotkey",
        properName:"AutoHotkey",
        category:"UTILITIES",
        chocoInstallPackage:"autohotkey",
        chocoPortablePackage:"autohotkey",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"sysinternals",
        properName:"Sysinternals",
        category:"UTILITIES",
        chocoInstallPackage:"sysinternals",
        chocoPortablePackage:"sysinternals",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"ccleaner",
        properName:"CCleaner",
        category:"UTILITIES",
        chocoInstallPackage:"ccleaner",
        chocoPortablePackage:"ccleaner",
        wingetPackage:"PiriformSoftware.CCleaner",
        scoopPackage:"" },
      { shortName:"launchy",
        properName:"Launchy",
        category:"UTILITIES",
        chocoInstallPackage:"launchy",
        chocoPortablePackage:"launchy",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"qbittorrent",
        properName:"qBittorrent",
        category:"FILESHARING",
        chocoInstallPackage:"qbittorrent",
        chocoPortablePackage:"qbittorrent",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"transmission",
        properName:"Transmission",
        category:"FILESHARING",
        chocoInstallPackage:"transmission",
        chocoPortablePackage:"transmission",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"deluge",
        properName:"Deluge",
        category:"FILESHARING",
        chocoInstallPackage:"deluge",
        chocoPortablePackage:"deluge",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"obs",
        properName:"OBS Studio",
        category:"CREATIVE",
        chocoInstallPackage:"obs-studio",
        chocoPortablePackage:"obs-studio",
        wingetPackage:"OBSProject.OBSStudio",
        scoopPackage:"" },
      { shortName:"audacity",
        properName:"Audacity",
        category:"CREATIVE",
        chocoInstallPackage:"audacity",
        chocoPortablePackage:"audacity",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"lame",
        properName:"LAME for Audacity",
        category:"CREATIVE",
        chocoInstallPackage:"audacity-lame",
        chocoPortablePackage:"audacity-lame",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"unity",
        properName:"Unity Hub",
        category:"CREATIVE",
        chocoInstallPackage:"unity-hub",
        chocoPortablePackage:"unity-hub",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"blender",
        properName:"Blender",
        category:"CREATIVE",
        chocoInstallPackage:"blender",
        chocoPortablePackage:"blender",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"paint.net",
        properName:"Paint.NET",
        category:"CREATIVE",
        chocoInstallPackage:"paint.net",
        chocoPortablePackage:"paint.net",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"gimp",
        properName:"GIMP",
        category:"CREATIVE",
        chocoInstallPackage:"gimp",
        chocoPortablePackage:"gimp",
        wingetPackage:"gimp.gimp",
        scoopPackage:"" },
      { shortName:"krita",
        properName:"Krita",
        category:"CREATIVE",
        chocoInstallPackage:"krita",
        chocoPortablePackage:"krita",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"inkscape",
        properName:"Inkscape",
        category:"CREATIVE",
        chocoInstallPackage:"inkscape",
        chocoPortablePackage:"inkscape",
        wingetPackage:"Inkscape.Inkscape",
        scoopPackage:"" },
      { shortName:"7zip",
        properName:"7-Zip",
        category:"COMPRESSION",
        chocoInstallPackage:"7zip",
        chocoPortablePackage:"7zip.portable",
        wingetPackage:"7zip.7zip",
        scoopPackage:"7zip" },
      { shortName:"peazip",
        properName:"PeaZip",
        category:"COMPRESSION",
        chocoInstallPackage:"peazip.install",
        chocoPortablePackage:"peazip",
        wingetPackage:"Giorgiotani.Peazip",
        scoopPackage:"" },
      { shortName:"winrar",
        properName:"WinRAR",
        category:"COMPRESSION",
        chocoInstallPackage:"winrar",
        chocoPortablePackage:"winrar",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"cpp-redistributable",
        properName:"Microsoft Visual C++ Redistributable",
        category:"RUNTIMES",
        chocoInstallPackage:"vcredist140",
        chocoPortablePackage:"vcredist140",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"silverlight",
        properName:"Microsoft Silverlight",
        category:"RUNTIMES",
        chocoInstallPackage:"silverlight",
        chocoPortablePackage:"silverlight",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"air",
        properName:"Adobe Air",
        category:"RUNTIMES",
        chocoInstallPackage:"adobeair",
        chocoPortablePackage:"adobeair",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"jre",
        properName:"Java Runtime (JRE) 8",
        category:"RUNTIMES",
        chocoInstallPackage:"javaruntime",
        chocoPortablePackage:"javaruntime",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"flash",
        properName:"Flash Player Plugin",
        category:"RUNTIMES",
        chocoInstallPackage:"flashplayerplugin",
        chocoPortablePackage:"flashplayerplugin",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"dropbox",
        properName:"Dropbox",
        category:"CLOUD",
        chocoInstallPackage:"dropbox",
        chocoPortablePackage:"dropbox",
        wingetPackage:"Dropbox.Dropbox",
        scoopPackage:"" },
      { shortName:"drive",
        properName:"Google Drive",
        category:"CLOUD",
        chocoInstallPackage:"googledrive",
        chocoPortablePackage:"googledrive",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"nextcloud",
        properName:"Nextcloud",
        category:"CLOUD",
        chocoInstallPackage:"nextcloud-client",
        chocoPortablePackage:"nextcloud-client",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"foxit",
        properName:"Foxit PDF Reader",
        category:"DOCUMENTS",
        chocoInstallPackage:"foxitreader",
        chocoPortablePackage:"foxitreader",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"sumatra",
        properName:"Sumatra PDF Reader",
        category:"DOCUMENTS",
        chocoInstallPackage:"sumatrapdf",
        chocoPortablePackage:"sumatrapdf",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"adobe-pdf",
        properName:"Adobe Reader",
        category:"DOCUMENTS",
        chocoInstallPackage:"adobe",
        chocoPortablePackage:"adobe",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"pdfcreator",
        properName:"PDFCreator",
        category:"DOCUMENTS",
        chocoInstallPackage:"pdfcreator",
        chocoPortablePackage:"pdfcreator",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"cutepdf",
        properName:"CutePDF",
        category:"DOCUMENTS",
        chocoInstallPackage:"cutepdf",
        chocoPortablePackage:"cutepdf",
        wingetPackage:"AcroSoftware.CutePDFWriter",
        scoopPackage:"" },
      { shortName:"libreoffice",
        properName:"LibreOffice",
        category:"DOCUMENTS",
        chocoInstallPackage:"libreoffice-fresh",
        chocoPortablePackage:"libreoffice-fresh",
        wingetPackage:"LibreOffice.LibreOffice",
        scoopPackage:"" },
      { shortName:"steam",
        properName:"Steam",
        category:"GAMING",
        chocoInstallPackage:"steam",
        chocoPortablePackage:"steam",
        wingetPackage:"",
        scoopPackage:"" },
      { shortName:"epic",
        properName:"Epic Games Launcher",
        category:"GAMING",
        chocoInstallPackage:"epicgameslauncher",
        chocoPortablePackage:"epicgameslauncher",
        wingetPackage:"EpicGames.EpicGamesLauncher",
        scoopPackage:"" } ];

    // const app = require("./appClass");
    // const fs = require("fs");

    let apps = [];

    // This also controls the order on the web page, yikes?
    const cat = {
      BROWSERS: { name: "Browsers", icon: "fas fa-globe-americas" },
      MEDIA: { name: "Media", icon: "fas fa-play-circle" },
      MESSAGING: { name: "Messaging", icon: "fas fa-comments" },
      GAMING: { name: "Gaming", icon: "fas fa-gamepad" },
      SECURITY: { name: "Security", icon: "fas fa-lock" },
      FILESHARING: { name: "File Sharing", icon: "fas fa-network-wired" },
      RUNTIMES: { name: "Runtimes", icon: "fas fa-map-signs" },
      CREATIVE: { name: "Creative", icon: "fas fa-paint-brush" },
      COMPRESSION: { name: "Compression", icon: "fas fa-file-archive" },
      DOCUMENTS: { name: "Documents", icon: "fas fa-file-alt" },
      CLOUD: { name: "Cloud Storage", icon: "fas fa-cloud" },
      UTILITIES: { name: "Utility", icon: "fas fa-tools" },
      DEVLANGS: { name: "Dev Languages", icon: "fas fa-code" },
      DEVTOOLS: { name: "Dev Tools", icon: "fas fa-code-branch" },
    };

    // Checked at build time
    {
      apps = appCsv
        .filter((app) => {
          return app.wingetPackage != "";
        })
        .map((app) => {
          return new App(app.properName, cat[app.category], app.wingetPackage);
        });
    }

    console.log(apps);

    // This could theoretically be done by just running .filter() on the component passing the
    // props to each category, but it seems cleaner to keep it here
    const appsByCategory = [];
    for (const catKey in cat) {
      if (cat.hasOwnProperty(catKey)) {
        const category = cat[catKey];
        appsByCategory.push({
          categoryName: category.name,
          categoryIcon: category.icon,
          apps: apps.filter((app) => {
            return app.category.name === category.name;
          }),
        });
      }
    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/App.svelte";

    function create_fragment$3(ctx) {
    	var section0, img, t0, h2, t1, a0, t3, a1, t5, t6, section1, updating_selectedByCategory, t7, section2, updating_allSelected, current;

    	function appselector_selectedByCategory_binding(value) {
    		ctx.appselector_selectedByCategory_binding.call(null, value);
    		updating_selectedByCategory = true;
    		add_flush_callback(() => updating_selectedByCategory = false);
    	}

    	let appselector_props = { appsByCategory: appsByCategory };
    	if (ctx.selectedByCategory !== void 0) {
    		appselector_props.selectedByCategory = ctx.selectedByCategory;
    	}
    	var appselector = new AppSelector({ props: appselector_props, $$inline: true });

    	binding_callbacks.push(() => bind(appselector, 'selectedByCategory', appselector_selectedByCategory_binding));

    	function output_allSelected_binding(value_1) {
    		ctx.output_allSelected_binding.call(null, value_1);
    		updating_allSelected = true;
    		add_flush_callback(() => updating_allSelected = false);
    	}

    	let output_props = {};
    	if (ctx.allSelected !== void 0) {
    		output_props.allSelected = ctx.allSelected;
    	}
    	var output = new Output({ props: output_props, $$inline: true });

    	binding_callbacks.push(() => bind(output, 'allSelected', output_allSelected_binding));

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			t1 = text("Checklatey is like\n    ");
    			a0 = element("a");
    			a0.textContent = "Ninite";
    			t3 = text("\n    but with the\n    ");
    			a1 = element("a");
    			a1.textContent = "Chocolatey";
    			t5 = text("\n    package manager for Windows! Select the programs you want, get the command\n    to install them all at once.");
    			t6 = space();
    			section1 = element("section");
    			appselector.$$.fragment.c();
    			t7 = space();
    			section2 = element("section");
    			output.$$.fragment.c();
    			attr_dev(img, "src", "checklatey-logo.svg");
    			attr_dev(img, "alt", "Checklatey");
    			add_location(img, file$3, 23, 2, 601);
    			attr_dev(a0, "href", "https://ninite.com/");
    			add_location(a0, file$3, 26, 4, 686);
    			attr_dev(a1, "href", "https://chocolatey.org/");
    			add_location(a1, file$3, 28, 4, 748);
    			add_location(h2, file$3, 24, 2, 654);
    			attr_dev(section0, "class", "header");
    			add_location(section0, file$3, 22, 0, 574);
    			attr_dev(section1, "class", "section");
    			add_location(section1, file$3, 34, 0, 929);
    			attr_dev(section2, "class", "section");
    			add_location(section2, file$3, 37, 0, 1025);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, img);
    			append_dev(section0, t0);
    			append_dev(section0, h2);
    			append_dev(h2, t1);
    			append_dev(h2, a0);
    			append_dev(h2, t3);
    			append_dev(h2, a1);
    			append_dev(h2, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, section1, anchor);
    			mount_component(appselector, section1, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, section2, anchor);
    			mount_component(output, section2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var appselector_changes = {};
    			if (!updating_selectedByCategory && changed.selectedByCategory) {
    				appselector_changes.selectedByCategory = ctx.selectedByCategory;
    			}
    			appselector.$set(appselector_changes);

    			var output_changes = {};
    			if (!updating_allSelected && changed.allSelected) {
    				output_changes.allSelected = ctx.allSelected;
    			}
    			output.$set(output_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(appselector.$$.fragment, local);

    			transition_in(output.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(appselector.$$.fragment, local);
    			transition_out(output.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section0);
    				detach_dev(t6);
    				detach_dev(section1);
    			}

    			destroy_component(appselector);

    			if (detaching) {
    				detach_dev(t7);
    				detach_dev(section2);
    			}

    			destroy_component(output);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	
      let selectedByCategory = appsByCategory.map(category => {
        return {
          name: category.name,
          selected: []
        };
      });
      // $: allSelected = selectedByCategory
      //   .map(category => {
      //     return category.selected;
      //   })
      //   .flat();

    	function appselector_selectedByCategory_binding(value) {
    		selectedByCategory = value;
    		$$invalidate('selectedByCategory', selectedByCategory);
    	}

    	function output_allSelected_binding(value_1) {
    		allSelected = value_1;
    		$$invalidate('allSelected', allSelected), $$invalidate('selectedByCategory', selectedByCategory);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('selectedByCategory' in $$props) $$invalidate('selectedByCategory', selectedByCategory = $$props.selectedByCategory);
    		if ('allSelected' in $$props) $$invalidate('allSelected', allSelected = $$props.allSelected);
    	};

    	let allSelected;

    	$$self.$$.update = ($$dirty = { selectedByCategory: 1 }) => {
    		if ($$dirty.selectedByCategory) { $$invalidate('allSelected', allSelected = selectedByCategory.flatMap(category => {
            return category.selected;
          })); }
    	};

    	return {
    		selectedByCategory,
    		allSelected,
    		appselector_selectedByCategory_binding,
    		output_allSelected_binding
    	};
    }

    class App$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$3.name });
    	}
    }

    Array.prototype.flat||Object.defineProperty(Array.prototype,"flat",{configurable:!0,value:function r(){var t=isNaN(arguments[0])?1:Number(arguments[0]);return t?Array.prototype.reduce.call(this,function(a,e){return Array.isArray(e)?a.push.apply(a,r.call(e,t-1)):a.push(e),a},[]):Array.prototype.slice.call(this)},writable:!0}),Array.prototype.flatMap||Object.defineProperty(Array.prototype,"flatMap",{configurable:!0,value:function(r){return Array.prototype.map.apply(this,arguments).flat()},writable:!0});

    const app = new App$1({
      target: document.body,
      props: {
        name: "world",
      },
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
