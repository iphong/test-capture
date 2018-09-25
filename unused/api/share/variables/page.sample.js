module.exports = {
	jsCode: '',
	cssCode: '',
	fonts: [
		{
			family: 'Lato'
		},
		{
			family: 'Oswald'
		},
		{
			family: 'Roboto'
		},
		{
			family: 'Playfair Display'
		}
	],
	items: [
		{
			type: 'Head',
			_id: 0,
			children: [8, 142, 144]
		},
		{
			type: 'Body',
			_id: 1,
			children: [2]
		},
		{
			type: 'Layout',
			_id: 2,
			children: [3, 12, 61, 91, 102, 110, 121, 138]
		},
		{
			type: 'Section',
			_id: 3,
			styles: {
				all: {
					'&': 'padding: 0px;'
				}
			},
			children: [4],
			containerWidth: '1600px',
			sectionName: 'Section #1'
		},
		{
			type: 'Row',
			_id: 4,
			styles: {
				all: {
					'&':
						'background-image: url("https://media.pagefly.io/file/get/layer10png-1508685880886.png"); background-repeat: no-repeat; background-position: left center; padding: 240px 0px; background-size: contain;'
				},
				mobile: {
					'&': 'padding: 40px 0px;'
				}
			},
			children: [5, 6],
			doubling: true,
			equals: false,
			cols: 2
		},
		{
			type: 'Row.Col',
			_id: 5,
			hideOnTablet: true,
			hideOnMobile: true
		},
		{
			type: 'Row.Col',
			_id: 6,
			styles: {
				mobile: {
					'&': 'text-align: center;'
				},
				tablet: {
					'&': 'text-align: center;'
				}
			},
			children: [7, 9, 10, 11]
		},
		{
			type: 'Heading',
			_id: 7,
			styles: {
				all: {
					'&': 'font-family: Lato; margin: 0px;'
				}
			},
			preset: 8,
			_title: {
				text: 'Fabulous'
			}
		},
		{
			type: 'Preset.TextPreset',
			_id: 8,
			styles: {
				all: {
					'&': 'font-family: Lato;'
				}
			},
			name: 'Lato'
		},
		{
			type: 'Heading',
			_id: 9,
			styles: {
				all: {
					'&':
						'font-family: Lato; font-size: 70px; text-transform: uppercase; line-height: 70px; margin: 0px 0px 20px;'
				},
				mobile: {
					'&': 'font-size: 42px; margin: 0px;'
				}
			},
			preset: 8,
			_title: {
				text: 'Collections'
			}
		},
		{
			type: 'Heading',
			_id: 10,
			styles: {
				all: {
					'&':
						'font-family: Lato; font-size: 24px; text-transform: uppercase; line-height: 24px; font-weight: 300; margin: 0px 0px 30px;'
				}
			},
			preset: 8,
			_title: {
				text: 'CLASSY AND SEXY'
			}
		},
		{
			type: 'Button',
			_id: 11,
			styles: {
				all: {
					'&':
						'background-color: rgb(243, 174, 180); color: rgb(255, 255, 255); padding: 10px 30px; font-weight: 700; border-style: none;'
				}
			},
			btnShape: 'rounded',
			_text: {
				text: 'SHOP NOW'
			}
		},
		{
			type: 'Section',
			_id: 12,
			children: [18],
			sectionName: 'Section #2'
		},
		{
			type: 'Row',
			_id: 18,
			children: [19, 43, 49, 55],
			doubling: true,
			equals: false,
			cols: 4
		},
		{
			type: 'Row.Col',
			_id: 19,
			children: [23]
		},
		{
			type: 'Block',
			_id: 23,
			styles: {
				all: {
					'&': 'display: flex;'
				}
			},
			children: [27, 28]
		},
		{
			type: 'Icon',
			_id: 27,
			styles: {
				all: {
					'&': 'font-size: 28px; color: rgb(216, 216, 216);'
				}
			},
			icon: 'truck',
			iconShape: 'square'
		},
		{
			type: 'Block',
			_id: 28,
			styles: {
				all: {
					'&': 'margin-left: 15px;'
				}
			},
			children: [35, 36]
		},
		{
			type: 'Heading',
			_id: 35,
			styles: {
				all: {
					'&': 'margin: 0px; font-size: 14px;'
				}
			},
			preset: 8,
			_title: {
				text: 'FREE SHIPPING/DELIVERY'
			}
		},
		{
			type: 'Paragraph',
			_id: 36,
			styles: {
				all: {
					'&': 'font-size: 14px;'
				}
			},
			preset: 8,
			_text: {
				text: 'On order over $250.00'
			}
		},
		{
			type: 'Row.Col',
			_id: 43,
			children: [44]
		},
		{
			type: 'Block',
			_id: 44,
			styles: {
				all: {
					'&': 'display: flex;'
				}
			},
			children: [45, 46]
		},
		{
			type: 'Icon',
			_id: 45,
			styles: {
				all: {
					'&': 'font-size: 28px; color: rgb(216, 216, 216);'
				}
			},
			icon: 'support',
			iconShape: 'square'
		},
		{
			type: 'Block',
			_id: 46,
			styles: {
				all: {
					'&': 'margin-left: 15px;'
				}
			},
			children: [47, 48]
		},
		{
			type: 'Heading',
			_id: 47,
			styles: {
				all: {
					'&': 'margin: 0px; font-size: 14px;'
				}
			},
			preset: 8,
			_title: {
				text: '24/7 CUSTOMER SERVICE'
			}
		},
		{
			type: 'Paragraph',
			_id: 48,
			styles: {
				all: {
					'&': 'font-size: 14px;'
				}
			},
			preset: 8,
			_text: {
				text: 'Call Us at +123 - 456 - 789'
			}
		},
		{
			type: 'Row.Col',
			_id: 49,
			children: [50]
		},
		{
			type: 'Block',
			_id: 50,
			styles: {
				all: {
					'&': 'display: flex;'
				}
			},
			children: [51, 52]
		},
		{
			type: 'Icon',
			_id: 51,
			styles: {
				all: {
					'&': 'font-size: 28px; color: rgb(216, 216, 216);'
				}
			},
			icon: 'shield',
			iconShape: 'square'
		},
		{
			type: 'Block',
			_id: 52,
			styles: {
				all: {
					'&': 'margin-left: 15px;'
				}
			},
			children: [53, 54]
		},
		{
			type: 'Heading',
			_id: 53,
			styles: {
				all: {
					'&': 'margin: 0px; font-size: 14px;'
				}
			},
			preset: 8,
			_title: {
				text: 'QUALITY ASSURANCE'
			}
		},
		{
			type: 'Paragraph',
			_id: 54,
			styles: {
				all: {
					'&': 'font-size: 14px;'
				}
			},
			preset: 8,
			_text: {
				text: 'We deliver the best products'
			}
		},
		{
			type: 'Row.Col',
			_id: 55,
			children: [56]
		},
		{
			type: 'Block',
			_id: 56,
			styles: {
				all: {
					'&': 'display: flex;'
				}
			},
			children: [57, 58]
		},
		{
			type: 'Icon',
			_id: 57,
			styles: {
				all: {
					'&': 'font-size: 28px; color: rgb(216, 216, 216);'
				}
			},
			icon: 'paypal',
			iconShape: 'square'
		},
		{
			type: 'Block',
			_id: 58,
			styles: {
				all: {
					'&': 'margin-left: 15px;'
				}
			},
			children: [59, 60]
		},
		{
			type: 'Heading',
			_id: 59,
			styles: {
				all: {
					'&': 'margin: 0px; font-size: 14px;'
				}
			},
			preset: 8,
			_title: {
				text: 'PAYMENT METHODS'
			}
		},
		{
			type: 'Paragraph',
			_id: 60,
			styles: {
				all: {
					'&': 'font-size: 14px;'
				}
			},
			preset: 8,
			_text: {
				text: 'Paypal accepted'
			}
		},
		{
			type: 'Section',
			_id: 61,
			styles: {
				all: {
					'&': 'padding: 0px;'
				}
			},
			children: [62],
			container: false,
			sectionName: 'Section #3'
		},
		{
			type: 'Row',
			_id: 62,
			styles: {
				all: {
					'&': 'margin: 0px;'
				}
			},
			children: [63, 64],
			doubling: true,
			equals: false,
			cols: 2,
			gutter: 0
		},
		{
			type: 'Row.Col',
			_id: 63,
			styles: {
				all: {
					'&': 'position: relative;'
				}
			},
			children: [66, 148]
		},
		{
			type: 'Row.Col',
			_id: 64,
			children: [69, 78]
		},
		{
			type: 'Image',
			_id: 66,
			styles: {
				all: {
					'&': 'width: 100%;'
				}
			},
			href: '/collections/all',
			classes: 'img-100',
			src: 'https://media.pagefly.io/file/get/layer25jpg1508832453377jpg-1519461737673.jpg'
		},
		{
			type: 'Row',
			_id: 69,
			styles: {
				all: {
					'&': 'margin: 0px; height: 50%;'
				},
				mobile: {
					'&': 'height: auto;'
				},
				tablet: {
					'&': 'height: auto;'
				}
			},
			children: [70, 71],
			equals: false,
			cols: 2,
			gutter: 0
		},
		{
			type: 'Row.Col',
			_id: 70,
			styles: {
				all: {
					'&': 'position: relative;'
				}
			},
			children: [72, 151]
		},
		{
			type: 'Row.Col',
			_id: 71,
			styles: {
				all: {
					'&':
						'background-color: rgb(245, 233, 219); display: flex; align-items: center; justify-content: center;'
				},
				mobile: {
					'&': 'padding: 20px 0px;'
				}
			},
			children: [82]
		},
		{
			type: 'Image',
			_id: 72,
			styles: {
				all: {
					'&': 'width: 100%;'
				}
			},
			href: '/collections/all',
			classes: 'img-100',
			src: 'https://media.pagefly.io/file/get/banner04jpg1508832552285jpg-1519461747627.jpg'
		},
		{
			type: 'Row',
			_id: 78,
			styles: {
				all: {
					'&':
						'margin: 0px; background-image: url("https://media.pagefly.io/file/get/layer68png-1508832597148.png"); background-repeat: no-repeat; background-position: right bottom; background-color: rgb(245, 245, 247); height: 50%;'
				},
				mobile: {
					'&': 'height: auto;'
				},
				tablet: {
					'&': 'height: auto; padding: 120px 0px 0px;'
				}
			},
			children: [79],
			doubling: true,
			equals: false,
			gutter: 0
		},
		{
			type: 'Row.Col',
			_id: 79,
			styles: {
				all: {
					'&': 'display: flex; align-items: flex-end;'
				},
				mobile: {
					'&': 'padding: 80px 0px 0px;'
				}
			},
			children: [86]
		},
		{
			type: 'Block',
			_id: 82,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [83, 84, 85]
		},
		{
			type: 'Heading',
			_id: 83,
			styles: {
				all: {
					'&': 'font-size: 14px; margin: 0px;'
				}
			},
			preset: 8,
			_title: {
				text: 'CURRENTLY ON'
			}
		},
		{
			type: 'Heading',
			_id: 84,
			styles: {
				all: {
					'&':
						'font-size: 80px; line-height: 1; font-family: "Playfair Display"; font-style: italic; margin: 0px 0px 25px;'
				}
			},
			preset: 8,
			_title: {
				text: 'SALE'
			}
		},
		{
			type: 'Button',
			_id: 85,
			styles: {
				all: {
					'&':
						'border-width: 0px 0px 1px; border-style: solid; border-color: rgb(145, 157, 169); font-family: Lato; text-transform: uppercase; color: rgb(50, 50, 50); padding: 0px 0px 5px;'
				}
			},
			btnStyle: 'plain',
			_icon: {
				icon: 'star'
			},
			_text: {
				text: 'Learn More'
			}
		},
		{
			type: 'Block',
			_id: 86,
			styles: {
				all: {
					'&': 'padding: 0px 0px 50px 50px;'
				},
				mobile: {
					'&': 'padding: 20px;'
				}
			},
			children: [87, 89, 90]
		},
		{
			type: 'Heading',
			_id: 87,
			styles: {
				all: {
					'&': 'font-family: "Playfair Display"; font-size: 25px; line-height: 30px; margin: 0px;'
				}
			},
			_title: {
				text: 'NEW ARRIVALS<br>MEN’S COLLECTION<br>'
			}
		},
		{
			type: 'Paragraph',
			_id: 89,
			styles: {
				all: {
					'&':
						'font-family: "Playfair Display"; color: rgb(50, 50, 50); font-weight: 400; font-size: 13px; font-style: italic; margin: 0px 0px 30px;'
				}
			},
			_text: {
				text: 'Newest outfits for men has just arrived.<br>'
			}
		},
		{
			type: 'Button',
			_id: 90,
			styles: {
				all: {
					'&':
						'border-width: 0px 0px 1px; border-style: solid; border-color: rgb(145, 157, 169); font-family: "Playfair Display"; text-transform: uppercase; color: rgb(50, 50, 50); padding: 0px 0px 5px; font-weight: 700;'
				}
			},
			btnStyle: 'plain',
			_icon: {
				icon: 'star'
			},
			_text: {
				text: 'Learn More'
			}
		},
		{
			type: 'Section',
			_id: 91,
			styles: {
				all: {
					'&': 'padding: 50px 0px; text-align: center;'
				},
				mobile: {
					'&': 'padding: 30px 0px;'
				},
				tablet: {
					'&': 'padding-top: 30px; padding-bottom: 30px;'
				}
			},
			children: [92, 96, 99],
			sectionName: 'Section #4'
		},
		{
			type: 'Row',
			_id: 92,
			children: [93]
		},
		{
			type: 'Row.Col',
			_id: 93,
			children: [94, 95]
		},
		{
			type: 'Heading',
			_id: 94,
			styles: {
				all: {
					'&':
						'font-size: 30px; line-height: 30px; color: rgb(50, 50, 50); font-weight: 400; letter-spacing: 7px; margin: 0px 0px 10px;'
				}
			},
			preset: 144,
			_title: {
				text: "WOMEN'S COLLECTION"
			}
		},
		{
			type: 'Paragraph',
			_id: 95,
			styles: {
				all: {
					'&': 'text-align: center; font-size: 18px;'
				}
			},
			preset: 8,
			_text: {
				text: 'Sale-off up to 50% for all items<br>'
			}
		},
		{
			type: 'Row',
			_id: 96,
			children: [97]
		},
		{
			type: 'Row.Col',
			_id: 97,
			children: [145]
		},
		{
			type: 'Row',
			_id: 99,
			children: [100]
		},
		{
			type: 'Row.Col',
			_id: 100,
			children: [101]
		},
		{
			type: 'Button',
			_id: 101,
			styles: {
				all: {
					'&':
						'background-color: rgb(50, 50, 50); color: rgb(255, 255, 255); border-style: none; font-family: Lato; padding: 15px 50px; border-radius: 50px;'
				}
			},
			preset: 142,
			iconPos: 'right',
			btnShape: 'rounded',
			_text: {
				text: 'Learn More'
			},
			_icon: {
				icon: 'angle-right'
			}
		},
		{
			type: 'Section',
			_id: 102,
			styles: {
				all: {
					'&':
						'background-color: rgb(219, 211, 200); background-image: url("https://media.pagefly.io/file/get/layer741png-1508833906415.png"); background-repeat: no-repeat; background-position: right bottom; padding: 50px 0px;'
				},
				mobile: {
					'&': 'margin-bottom: 4px;'
				},
				tablet: {
					'&': 'background-size: cover; background-repeat: no-repeat; background-position: right top;'
				}
			},
			children: [103],
			sectionName: 'Section #5'
		},
		{
			type: 'Row',
			_id: 103,
			children: [104]
		},
		{
			type: 'Row.Col',
			_id: 104,
			styles: {
				mobile: {
					'&': 'text-align: center;'
				}
			},
			children: [106, 107, 108, 109]
		},
		{
			type: 'Heading',
			_id: 106,
			styles: {
				all: {
					'&': 'font-size: 14px; margin: 0px;'
				},
				mobile: {
					'&': 'color: rgb(255, 255, 255);'
				}
			},
			preset: 8,
			_title: {
				text: 'THE STYLE THAT FITS EVERYTHING'
			}
		},
		{
			type: 'Heading',
			_id: 107,
			styles: {
				all: {
					'&':
						'font-family: "Playfair Display"; font-size: 50px; line-height: 50px; color: rgb(56, 56, 56); font-style: italic; margin: 0px 0px 20px;'
				},
				mobile: {
					'&': 'color: rgb(255, 255, 255);'
				}
			},
			_title: {
				text: 'Denim Collection'
			}
		},
		{
			type: 'Paragraph',
			_id: 108,
			styles: {
				all: {
					'&': 'margin: 0px 0px 30px; font-size: 14px;'
				},
				mobile: {
					'&': 'color: rgb(255, 255, 255);'
				}
			},
			preset: 8,
			_text: {
				text:
					'The daily jeans items that can go with your every outfits.<br>Flexible. Durable. But never out of mode.<br>'
			}
		},
		{
			type: 'Button',
			_id: 109,
			styles: {
				all: {
					'&':
						'background-color: rgb(50, 50, 50); color: rgb(255, 255, 255); border-style: none; font-family: Lato; padding: 15px 50px; border-radius: 50px;'
				}
			},
			preset: 142,
			iconPos: 'right',
			btnShape: 'rounded',
			_text: {
				text: 'Learn More'
			},
			_icon: {
				icon: 'angle-right'
			}
		},
		{
			type: 'Section',
			_id: 110,
			styles: {
				all: {
					'&': 'padding: 50px 0px; text-align: center;'
				},
				mobile: {
					'&': 'padding: 30px 0px;'
				},
				tablet: {
					'&': 'padding-top: 30px; padding-bottom: 30px;'
				}
			},
			children: [111, 112, 113],
			sectionName: 'Section #6'
		},
		{
			type: 'Row',
			_id: 111,
			children: [114]
		},
		{
			type: 'Row',
			_id: 112,
			children: [115]
		},
		{
			type: 'Row',
			_id: 113,
			children: [116]
		},
		{
			type: 'Row.Col',
			_id: 114,
			children: [117, 118]
		},
		{
			type: 'Row.Col',
			_id: 115,
			children: [119]
		},
		{
			type: 'Row.Col',
			_id: 116,
			children: [120]
		},
		{
			type: 'Heading',
			_id: 117,
			styles: {
				all: {
					'&':
						'font-size: 30px; line-height: 30px; color: rgb(50, 50, 50); font-weight: 400; letter-spacing: 7px; margin: 0px 0px 10px;'
				}
			},
			preset: 144,
			_title: {
				text: "MEN'S COLLECTION"
			}
		},
		{
			type: 'Paragraph',
			_id: 118,
			styles: {
				all: {
					'&': 'text-align: center; font-size: 18px;'
				}
			},
			preset: 8,
			_text: {
				text: 'Sale-off up to 50% for all items<br>'
			}
		},
		{
			type: 'Shopify.Products',
			_id: 119,
			styles: {
				all: {
					'&': 'margin: -15px;',
					'&>.grid__column>div>div>div>.product__button':
						'background-color: rgb(245, 233, 219); color: rgb(34, 34, 34);'
				}
			},
			limit: 8
		},
		{
			type: 'Button',
			_id: 120,
			styles: {
				all: {
					'&':
						'background-color: rgb(50, 50, 50); color: rgb(255, 255, 255); border-style: none; font-family: Lato; padding: 15px 50px; border-radius: 50px;'
				}
			},
			preset: 142,
			iconPos: 'right',
			btnShape: 'rounded',
			_text: {
				text: 'Learn More'
			},
			_icon: {
				icon: 'angle-right'
			}
		},
		{
			type: 'Section',
			_id: 121,
			styles: {
				mobile: {
					'&': 'padding-top: 0px; padding-bottom: 30px;'
				},
				tablet: {
					'&': 'padding-top: 0px; padding-bottom: 30px;'
				}
			},
			children: [122],
			sectionName: 'Section #7'
		},
		{
			type: 'Row',
			_id: 122,
			children: [123, 128, 130, 132, 134, 136],
			doubling: true,
			stackable: false,
			equals: false,
			cols: 6
		},
		{
			type: 'Row.Col',
			_id: 123,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [127]
		},
		{
			type: 'Image',
			_id: 127,
			src: 'https://media.pagefly.io/file/get/layer1png-1508834166619.png'
		},
		{
			type: 'Row.Col',
			_id: 128,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [129]
		},
		{
			type: 'Image',
			_id: 129,
			src: 'https://media.pagefly.io/file/get/layer2png-1508834182665.png'
		},
		{
			type: 'Row.Col',
			_id: 130,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [131]
		},
		{
			type: 'Image',
			_id: 131,
			src: 'https://media.pagefly.io/file/get/layer3png-1508834185344.png'
		},
		{
			type: 'Row.Col',
			_id: 132,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [133]
		},
		{
			type: 'Image',
			_id: 133,
			src: 'https://media.pagefly.io/file/get/layer4png-1508834187957.png'
		},
		{
			type: 'Row.Col',
			_id: 134,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [135]
		},
		{
			type: 'Image',
			_id: 135,
			src: 'https://media.pagefly.io/file/get/layer5png-1508834190730.png'
		},
		{
			type: 'Row.Col',
			_id: 136,
			styles: {
				all: {
					'&': 'text-align: center;'
				}
			},
			children: [137]
		},
		{
			type: 'Image',
			_id: 137,
			src: 'https://media.pagefly.io/file/get/layer6png-1508834193621.png'
		},
		{
			type: 'Section',
			_id: 138,
			styles: {
				all: {
					'&': 'background-color: rgb(247, 248, 249);'
				},
				mobile: {
					'&': 'padding-top: 30px; padding-bottom: 30px;'
				}
			},
			children: [139],
			sectionName: 'Section #8'
		},
		{
			type: 'Row',
			_id: 139,
			children: [140]
		},
		{
			type: 'Row.Col',
			_id: 140,
			children: [143]
		},
		{
			type: 'Preset.ButtonPreset',
			_id: 142,
			styles: {
				all: {
					'&':
						'background-color: rgb(50, 50, 50); color: rgb(255, 255, 255); font-family: Lato; border-radius: 50px; border: 1px solid rgb(229, 229, 229); padding: 15px 50px;'
				}
			},
			name: 'Learn More '
		},
		{
			type: 'MailChimp',
			_id: 143,
			styles: {
				all: {
					'&':
						'margin: 0px auto; border-style: solid; border-width: 2px; border-color: rgb(216, 216, 216); width: 500px;',
					'&>div>input': 'height: 50px; background-color: rgb(255, 255, 255); border-style: none;',
					'&>div>button':
						'height: 50px; background-color: rgb(255, 255, 255); color: rgb(34, 34, 34); font-size: 16px;'
				},
				mobile: {
					'&': 'width: 100%;'
				}
			},
			button: '',
			placeholder: 'Sign up to get our newsletter',
			icon: 'fa-envelope-o'
		},
		{
			type: 'Preset.TextPreset',
			_id: 144,
			styles: {
				all: {
					'&':
						'font-family: Lato; font-size: 30px; line-height: 30px; color: rgb(50, 50, 50); font-weight: 400; letter-spacing: 7px; margin: 0px 0px 10px;'
				}
			},
			name: "MEN'S COLLECTION "
		},
		{
			type: 'Shopify.Products',
			_id: 145,
			styles: {
				all: {
					'&>.grid__column>div>div>div>.product__button': 'background-color: rgb(243, 174, 180);'
				}
			},
			limit: 8
		},
		{
			type: 'Block',
			_id: 148,
			styles: {
				all: {
					'&': 'position: absolute; left: 50px; bottom: 25%;'
				},
				mobile: {
					'&': 'left: 10px; right: 10px;'
				}
			},
			children: [149, 150]
		},
		{
			type: 'Heading',
			_id: 149,
			styles: {
				all: {
					'&':
						'font-family: "Playfair Display"; font-size: 48px; line-height: 48px; color: rgb(245, 233, 219); margin: 0px 0px 20px;'
				}
			},
			_title: {
				text: 'Summer &amp; Autumn'
			}
		},
		{
			type: 'Button',
			_id: 150,
			styles: {
				all: {
					'&':
						'border-width: 0px 0px 1px; border-style: solid; border-color: rgb(145, 157, 169); font-family: Lato; text-transform: uppercase; color: rgb(245, 233, 219); padding: 0px 0px 5px;'
				}
			},
			btnStyle: 'plain',
			_icon: {
				icon: 'star'
			},
			_text: {
				text: 'Learn More'
			}
		},
		{
			type: 'Block',
			_id: 151,
			styles: {
				all: {
					'&':
						'position: absolute; left: 50%; transform: translateX(-50%); bottom: 25%; text-align: center; white-space: nowrap;'
				}
			},
			children: [152, 154]
		},
		{
			type: 'Heading',
			_id: 152,
			styles: {
				all: {
					'&':
						'font-family: "Playfair Display"; font-size: 48px; line-height: 48px; color: rgb(50, 50, 50); margin: 0px 0px 10px;'
				}
			},
			_title: {
				text: 'hot trends'
			}
		},
		{
			type: 'Heading',
			_id: 154,
			styles: {
				all: {
					'&': 'font-family: Lato; font-size: 14px; color: rgb(50, 50, 50); margin: 0px;'
				}
			},
			_title: {
				text: 'IN FASHION'
			}
		}
	],
	salt: 'bzl39uoysh5',
	id: '106503',
	pb_version: 250,
	created_version: 230,
	selected_template: ''
}
