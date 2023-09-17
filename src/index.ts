import './polyfills.js';

type ClassTarget = abstract new (...args: unknown[]) => unknown;

function inject<Class extends ClassTarget>(
  target: Class,
  context: ClassDecoratorContext<Class>
): void {
  /*
   * Issue no.1 - `context.metadata` equals 'undefined' in decorator functions.
   * SWC outputs 'context.metadata = undefined'
   * TSC outputs 'context.metadata = {}'
   */
  console.log('context.metadata = ' + JSON.stringify(context.metadata)); // undefined, should be

  // Let's then manually initialize `context.metadata` object
  Object.defineProperty(context, 'metadata', {
    value: Object.create(null),
    enumerable: true,
    configurable: true,
    writable: true,
  });

  // Store something in the metadata object
  context.metadata.foo = 'bar';
}

@inject
class App {
}

/*
 * Issue no.2 - Nothing actually gets saved in the metadata, even though we stored `{"foo"="bar"}` in the decorator.
 * SWC outputs 'App[Symbol.metadata] = null'
 * TSC outputs 'App[Symbol.metadata] = {}'
 */
console.log('App[Symbol.metadata] = ' + JSON.stringify(App[Symbol.metadata]));

