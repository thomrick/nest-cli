import { strings } from '@angular-devkit/core';
import { apply, mergeWith, move, Rule, Source, template, url } from '@angular-devkit/schematics';
import { join } from 'path';
import { TEMPLATE_ROOT_PATH } from '../constants';
import { DEFAULT_LANGUAGE } from '../defaults';
import { ConfigurationOptions } from './configuration.schema';

export function main(options: ConfigurationOptions): Rule {
  return mergeWith(generate(transform(options)));
}

function transform(options: ConfigurationOptions): ConfigurationOptions {
  const target: ConfigurationOptions = Object.assign({}, options);
  target.language =
    target.language !== undefined ? target.language : DEFAULT_LANGUAGE;
  target.collection =
    target.collection !== undefined ? target.collection : '@nestjs/schematics';
  return target;
}

function generate(options: ConfigurationOptions): Source {
  return apply(url(join(TEMPLATE_ROOT_PATH, 'configuration')), [
    template({
      ...strings,
      ...options,
    }),
    move(options.project),
  ]);
}
