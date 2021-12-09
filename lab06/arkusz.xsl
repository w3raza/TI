<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" version="1.0"  />
<xsl:param name="sortby"/>
<xsl:template match="/">

<html> 
    <head>
        <style>
            table {
            border-style: inset;
            border-color:  #dfdfdf;
            border-width: 5px;
            }

            th {
            border-width: 1px;
            border-style: inset;
            border-color: rgb(206, 206, 206);
            background-color: rgb(97, 164, 142);
            }

            td {
            border-width: 1px;
            border-style: inset;
            border-color: rgb(206, 206, 206);
            background-color: rgb(195, 255, 236);
            }


            .main_title {
                width: 100%;
                background-color: rgb(255, 151, 151);
            }

            .Books {
            background: #bd3c7c;
            }

            body table.tr:nth-child(even) {
                background: rgb(201, 201, 201);
            }
       </style>
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
            <xsl:choose>
                    <xsl:when test="$sortby = 'name'">
                      <xsl:for-each select="book">
                        <xsl:sort select="author/name/text()"/>
                        <tr>
                            <td><xsl:value-of select="title" /></td>
                            <td><xsl:value-of select="author" /></td>
                            <td><xsl:value-of select="price" /> PLN </td>
                        </tr>
                    </xsl:for-each> 
                  </xsl:when>
                  <xsl:when test="$sortby = 'last_name'">
                      <xsl:for-each select="book">
                        <xsl:sort select="author/last_name/text()"/>
                        <tr>
                            <td><xsl:value-of select="title" /></td>
                            <td><xsl:value-of select="author" /></td>
                            <td><xsl:value-of select="$sortby" /> PLN</td>
                        </tr>
                    </xsl:for-each> 
                  </xsl:when>
                   <xsl:when test="$sortby = 'title'">
                      <xsl:for-each select="book">
                        <xsl:sort select="title/text()"/>
                        <tr>
                            <td><xsl:value-of select="title" /></td>
                            <td><xsl:value-of select="author" /></td>
                            <td><xsl:value-of select="price" /> PLN xd</td>
                        </tr>
                    </xsl:for-each> 
                  </xsl:when>
                  <xsl:otherwise>
                      <xsl:for-each select="book">
                        <xsl:sort select="author/name/text()"/>
                        <tr>
                            <td><xsl:value-of select="title" /></td>
                            <td><xsl:value-of select="author" /></td>
                            <td><xsl:value-of select="price" /> PLN</td>
                        </tr>
                    </xsl:for-each> 
                  </xsl:otherwise>
                </xsl:choose>
        </xsl:for-each> 
        </tbody> 
        </table>
    </body> 
 </html>

</xsl:template>
</xsl:stylesheet>