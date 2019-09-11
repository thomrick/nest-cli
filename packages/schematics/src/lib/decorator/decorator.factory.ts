import { strings } from '@angular-devkit/core';
import { apply, chain, mergeWith, move, Rule, SchematicContext, SchematicsException, Source, template, url } from '@angular-devkit/schematics';
import { join } from 'path';
import { Location, NameParser } from '../../utils/name.parser';
import { mergeSourceRoot } from '../../utils/source-root.helpers';
import { TEMPLATE_ROOT_PATH } from '../constants';
import { DecoratorOptions } from './decorator.schema';

export function main(options: DecoratorOptions): Rule {
  options = transform(options);
  return chain([mergeSourceRoot(options), mergeWith(generate(options))]);
}

function transform(options: DecoratorOptions): DecoratorOptions {
  const target: DecoratorOptions = Object.assign({}, options);
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

function generate(options: DecoratorOptions): Source {
  return (context: SchematicContext) =>
    apply(url(join(TEMPLATE_ROOT_PATH, 'decorator', options.language)), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}
