import {HeaderQuery} from 'storefrontapi.generated';
import {HeaderProps} from './types/HeaderProps';
import {Viewport} from './types/Viewport';
import {useRootLoaderData} from '~/lib/root-data';
import {NavLink} from '@remix-run/react';
import {activeLinkStyle} from './functions/activeLinkStyle';
import {FALLBACK_HEADER_MENU} from './graphql/fallbackHeaderMenu';
import HeaderNavLink from './HeaderNavLink';
import {useHeaderContext} from './context/headerContext';

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const {setHeaderKey} = useHeaderContext();
  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className="flex justify-center gap-4" role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <HeaderNavLink href={url} key={item.id}>
            <NavLink
              className=""
              end
              onClick={closeAside}
              prefetch="intent"
              // style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          </HeaderNavLink>
        );
      })}
    </nav>
  );
}
