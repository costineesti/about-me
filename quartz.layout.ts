import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.RecentNotes(
      { limit: 5,
        showTags: false,
        sort: (f1, f2) => {
          // Sort by frontmatter date first, then by modified date
          const getValidDate = (file: any): Date => {
            if (file.frontmatter?.date) {
              const frontmatterDate = new Date(file.frontmatter.date)
              if (!isNaN(frontmatterDate.getTime())) {
                return frontmatterDate
              }
            }
            if (file.dates?.modified) {
              const modifiedDate = file.dates.modified instanceof Date ? file.dates.modified : new Date(file.dates.modified)
              if (!isNaN(modifiedDate.getTime())) {
                return modifiedDate
              }
            }
            return new Date(0) // Fallback to epoch
          }
          
          const date1 = getValidDate(f1)
          const date2 = getValidDate(f2)
          return date2.getTime() - date1.getTime() // Most recent first
        }
       }
    )),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.RecentNotes()),
  ],
  right: [],
}
