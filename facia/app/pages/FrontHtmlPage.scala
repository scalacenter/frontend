package pages

import common.Edition
import conf.switches.Switches.WeAreHiring
import html.{HtmlPage, Styles}
import html.HtmlPageHelpers._
import model.{ApplicationContext, PressedPage}
import play.api.mvc.RequestHeader
import play.twirl.api.Html
import views.html.fragments.commercial.pageSkin
import views.html.fragments._
import views.html.fragments.page.body.{bodyTag, breakingNewsDiv, mainContent, skipToMainContent}
import views.html.fragments.page.head.{fixIEReferenceErrors, headTag, titleTag, weAreHiring}
import views.html.fragments.page.head.stylesheets.{criticalStyleInline, criticalStyleLink, styles}
import views.html.fragments.page.{devTakeShot, htmlTag}

object FrontHtmlPage extends HtmlPage[PressedPage] {

  def cleanedFrontBody()(implicit page: PressedPage, request: RequestHeader, context: ApplicationContext): Html = {
    import views.support.`package`.withJsoup
    import views.support.{BulletCleaner, CommercialComponentHigh, CommercialMPUForFronts}
    val html: Html = frontBody(page)
    val edition = Edition(request)
    withJsoup(BulletCleaner(html.toString))(
      CommercialComponentHigh(page.frontProperties.isPaidContent, page.isNetworkFront, page.metadata.hasPageSkin(edition)),
      CommercialMPUForFronts(page.isNetworkFront)
    )
  }

  def allStyles(implicit applicationContext: ApplicationContext, request: RequestHeader): Styles = new Styles {
    override def criticalCssLink: Html = criticalStyleLink(FaciaCSSFile)
    override def criticalCssInline: Html = criticalStyleInline(Html(common.Assets.css.head(Some("facia"))))
    override def linkCss: Html = stylesheetLink(s"stylesheets/$FaciaCSSFile.css")

    override def oldIECriticalCss: Html = stylesheetLink(s"stylesheets/old-ie.head.$FaciaCSSFile.css")
    override def oldIELinkCss: Html = stylesheetLink(s"stylesheets/old-ie.$ContentCSSFile.css")

    override def IE9LinkCss: Html = stylesheetLink(s"stylesheets/ie9.head.$FaciaCSSFile.css")
    override def IE9CriticalCss: Html = stylesheetLink(s"stylesheets/ie9.$ContentCSSFile.css")
  }

  def html(page: PressedPage)(implicit request: RequestHeader, applicationContext: ApplicationContext): Html = {
    implicit val p: PressedPage = page
    htmlTag(
      headTag(
        weAreHiring() when WeAreHiring.isSwitchedOn,
        titleTag(),
        metaData(),
        frontMeta(),
        styles(allStyles),
        fixIEReferenceErrors(),
        inlineJSBlocking()
      ),
      bodyTag(classes = defaultBodyClasses)(
        message(),
        skipToMainContent(),
        pageSkin() when page.metadata.hasPageSkinOrAdTestPageSkin(Edition(request)),
        guardianHeaderHtml(),
        mainContent(),
        breakingNewsDiv(),
        cleanedFrontBody(),
        footer(),
        inlineJSNonBlocking(),
        analytics.base()
      ),
      devTakeShot()
    )
  }

}
