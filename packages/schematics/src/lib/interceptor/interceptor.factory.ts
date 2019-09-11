import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  url,
} from '@angular-devkit/schematics';
import { join } from 'path';
import { Location, NameParser } from '../../utils/name.parser';
import { mergeSourceRoot } from '../../utils/source-root.helpers';
import { TEMPLATE_ROOT_PATH } from '../constants';
import { InterceptorOptions } from './interceptor.schema';

export function main(options: InterceptorOptions): Rule {
  options = transform(options);
  return chain([mergeSourceRoot(options), mergeWith(generate(options))]);
}

function transform(options: InterceptorOptions): InterceptorOptions {
  const target: InterceptorOptions = Object.assign({}, options);
  if (!target.name) {
    throw new SchematicsException('Option (name) is required.');
  }
  const location: Location = new NameParser().parse(target);
  target.name = strings.dasherize(location.name);
  target.path = strings.dasherize(location.path);
  target.language = target.language !== undefined ? target.language : 'ts';

  target.path = target.flat
    ? target.path
    : join(target.path, target.name);
  return target;
}

function generate(options: InterceptorOptions): Source {
  return (context: SchematicContext) =>
    apply(url(join(TEMPLATE_ROOT_PATH, 'interceptor', options.language)), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}
