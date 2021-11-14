<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" version="1.0"  />
<xsl:template match="/">

<html> 
    <head>
        <link rel="stylesheet" href="style.css" type="text/css"/>
       <title>Library</title> 
    </head> 
    <body> 
        <table width="560" border="1"> 
        <tbody>
            <tr> 
                <th class="Books" colspan="3">Library:</th>
            </tr>
        <xsl:for-each select="library/division">
          <xsl:sort select="div_name/text()"/>
                <tr> 
                   <th class="main_title" colspan="3"><xsl:value-of select="div_name" /></th>
                </tr>
                <tr> 
                    <th>title</th>
                    <th width="150">author</th>
                    <th width="80">price</th>
                </tr> 
            <xsl:for-each select="book">
                <xsl:sort select="author/name/text()"/>
                <tr>
                    <td><xsl:value-of select="title" /></td>
                    <td><xsl:value-of select="author" /></td>
                    <td><xsl:value-of select="price" /> PLN</td>
                </tr>
            </xsl:for-each> 
        </xsl:for-each> 
        </tbody> 
        </table> 
          <br/> 
   
    </body> 
 </html>

</xsl:template>
</xsl:stylesheet>