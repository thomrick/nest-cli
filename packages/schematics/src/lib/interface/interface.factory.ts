import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
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
import { InterfaceOptions } from './interface.schema';

export function main(options: InterfaceOptions): Rule {
  options = transform(options);
  return chain([mergeSourceRoot(options), mergeWith(generate(options))]);
}

function transform(options: InterfaceOptions): InterfaceOptions {
  const target: InterfaceOptions = Object.assign({}, options);
  if (!target.name) {
    throw new SchematicsException('Option (name) is required.');
  }
  const location: Location = new NameParser().parse(target);
  target.name = strings.dasherize(location.name);
  target.path = strings.dasherize(location.path);

  target.path = target.flat
    ? target.path
    : join(target.path, target.name);
  return target;
}

function generate(options: InterfaceOptions): Source {
  return (context: SchematicContext) =>
    apply(url(join(TEMPLATE_ROOT_PATH, 'interface')), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}
