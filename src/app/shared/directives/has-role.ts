import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Directive({
  selector: '[appHasRole]',
})
export class HasRole {
  private tpl = inject(TemplateRef<unknown>);
  private vcr = inject(ViewContainerRef);
  private auth = inject(Auth);

  @Input() set appHasRole(roles : string[]){
      this.vcr.clear();
      if(this.auth.hasAnyRole(roles)){
        this.vcr.createEmbeddedView(this.tpl);
      }
  }
}
