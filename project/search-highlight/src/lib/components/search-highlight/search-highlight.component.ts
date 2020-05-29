/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';

import { takeUntil } from 'rxjs/operators';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NavigateToFolder, ViewNodeAction } from '@alfresco/aca-shared/store';

@Component({
  selector: 'aca-search-results-row-highlight',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search-highlight.component.html',
  styleUrls: ['./search-highlight.component.scss']
})
export class SearchHighlightComponent implements OnInit, OnDestroy {
  @Input()
  context: any;

  @Input()
  locationField: TemplateRef<any>;

  private node: MinimalNodeEntity;
  private onDestroy$ = new Subject<boolean>();
  name$ = new BehaviorSubject<string>('');
  title$ = new BehaviorSubject<string>('');
  highlight: [];

  constructor(
    private store: Store<any>,
    private alfrescoApiService: AlfrescoApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateValues();

    this.alfrescoApiService.nodeUpdated
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((node: any) => {
        const row = this.context.row;
        if (row) {
          const { entry } = row.node;

          if (entry.id === node.id) {
            entry.name = node.name;
            entry.properties = Object.assign({}, node.properties);
            entry.search = Object.assign({}, node.search);
            this.updateValues();
          }
        }
      });
  }

  private updateValues() {
    this.node = this.context.row.node;

    const highlightAll =
      this.node.entry['search'] && this.node.entry['search']['highlight']
        ? this.node.entry['search']['highlight']
        : [];

    const { name, properties } = this.node.entry;
    const title = properties ? properties['cm:title'] : '';

    this.name$.next(name);

    if (title !== name) {
      this.title$.next(title ? `( ${title} )` : '');
    }

    highlightAll.forEach(elem => {
      if (elem.field === 'cm:name') {
        this.name$.next(elem.snippets[0]);
      }

      if (elem.field === 'cm:title' && title !== name) {
        this.title$.next(`( ${elem.snippets[0]} )`);
      }

      if (elem.field === 'cm:content') {
        this.highlight = elem.snippets;
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  get description(): string {
    const { properties } = this.node.entry;
    return properties ? properties['cm:description'] : '';
  }

  get modifiedAt(): Date {
    return this.node.entry.modifiedAt;
  }

  get size(): number {
    const { content } = this.node.entry;
    return content ? content.sizeInBytes : null;
  }

  get user(): string {
    return this.node.entry.modifiedByUser.displayName;
  }

  get isFile(): boolean {
    return this.node.entry.isFile;
  }

  showPreview(event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(
      new ViewNodeAction(this.node.entry.id, { location: this.router.url })
    );
  }

  navigate(event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(new NavigateToFolder(this.node));
  }
}
